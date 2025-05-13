const express = require('express');
const router = express.Router();
const Weather = require('../models/Weather');

// @route   GET api/weather
// @desc    Get all weather data
// @access  Public
router.get('/', async (req, res) => {
  try {
    const weather = await Weather.find();
    res.json(weather);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/weather/latest
// @desc    Get latest weather data
// @access  Public
router.get('/latest', async (req, res) => {
  try {
    const weather = await Weather.find().sort({ time: -1 }).limit(1);
    res.json(weather[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/weather/date/:date
// @desc    Get weather data for a specific date (YYYY-MM-DD)
// @access  Public
router.get('/date/:date', async (req, res) => {
  try {
    const dateStr = req.params.date;
    const weather = await Weather.find({
      time: { $regex: `^${dateStr}` }
    });
    
    if (weather.length === 0) {
      return res.status(404).json({ msg: 'No weather data found for this date' });
    }
    
    res.json(weather);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/weather/range
// @desc    Get weather data for a date range
// @access  Public
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ msg: 'Please provide startDate and endDate parameters' });
    }
    
    const weather = await Weather.find({
      time: { 
        $gte: startDate, 
        $lte: endDate + 'T23:59' 
      }
    }).sort({ time: 1 });
    
    if (weather.length === 0) {
      return res.status(404).json({ msg: 'No weather data found for this date range' });
    }
    
    res.json(weather);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/weather/filter
// @desc    Get weather data with various filters
// @access  Public
router.get('/filter', async (req, res) => {
  try {
    const {
      minTemp,
      maxTemp,
      minHumidity,
      maxHumidity,
      minPrecipitation,
      maxPrecipitation,
      startDate,
      endDate,
      limit,
      sort
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Date range filter
    if (startDate || endDate) {
      filter.time = {};
      if (startDate) filter.time.$gte = startDate;
      if (endDate) filter.time.$lte = endDate + 'T23:59';
    }
    
    // Temperature filter
    if (minTemp || maxTemp) {
      filter.temperature_2m_C = {};
      if (minTemp) filter.temperature_2m_C.$gte = parseFloat(minTemp);
      if (maxTemp) filter.temperature_2m_C.$lte = parseFloat(maxTemp);
    }
    
    // Humidity filter
    if (minHumidity || maxHumidity) {
      filter.relative_humidity_2m_percent = {};
      if (minHumidity) filter.relative_humidity_2m_percent.$gte = parseFloat(minHumidity);
      if (maxHumidity) filter.relative_humidity_2m_percent.$lte = parseFloat(maxHumidity);
    }
    
    // Precipitation filter
    if (minPrecipitation || maxPrecipitation) {
      filter.precipitation_mm = {};
      if (minPrecipitation) filter.precipitation_mm.$gte = parseFloat(minPrecipitation);
      if (maxPrecipitation) filter.precipitation_mm.$lte = parseFloat(maxPrecipitation);
    }
    
    // Build sort object
    let sortObj = { time: 1 }; // Default sort by time ascending
    if (sort) {
      const [field, order] = sort.split(':');
      sortObj = { [field]: order === 'desc' ? -1 : 1 };
    }
    
    // Execute query with pagination
    const limitNum = parseInt(limit) || 100;
    
    const weather = await Weather.find(filter)
      .sort(sortObj)
      .limit(limitNum);
    
    if (weather.length === 0) {
      return res.status(404).json({ msg: 'No weather data found matching the filters' });
    }
    
    res.json(weather);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/weather/stats
// @desc    Get weather statistics for a date range
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ msg: 'Please provide startDate and endDate parameters' });
    }
    
    const stats = await Weather.aggregate([
      {
        $match: {
          time: { 
            $gte: startDate, 
            $lte: endDate + 'T23:59' 
          }
        }
      },
      {
        $group: {
          _id: null,
          avgTemperature: { $avg: '$temperature_2m_C' },
          minTemperature: { $min: '$temperature_2m_C' },
          maxTemperature: { $max: '$temperature_2m_C' },
          avgHumidity: { $avg: '$relative_humidity_2m_percent' },
          totalPrecipitation: { $sum: '$precipitation_mm' },
          recordCount: { $sum: 1 }
        }
      }
    ]);
    
    if (stats.length === 0) {
      return res.status(404).json({ msg: 'No weather data found for this date range' });
    }
    
    res.json(stats[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/weather/hourly-stats/:date
// @desc    Get hourly weather statistics for a specific date
// @access  Public
router.get('/hourly-stats/:date', async (req, res) => {
  try {
    const dateStr = req.params.date;
    
    const hourlyStats = await Weather.aggregate([
      {
        $match: {
          time: { $regex: `^${dateStr}` }
        }
      },
      {
        $group: {
          _id: { $substr: ['$time', 11, 2] }, // Extract hour from time
          avgTemperature: { $avg: '$temperature_2m_C' },
          avgHumidity: { $avg: '$relative_humidity_2m_percent' },
          totalPrecipitation: { $sum: '$precipitation_mm' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    if (hourlyStats.length === 0) {
      return res.status(404).json({ msg: 'No weather data found for this date' });
    }
    
    res.json(hourlyStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/weather/:id
// @desc    Get weather data by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const weather = await Weather.findById(req.params.id);
    
    if (!weather) {
      return res.status(404).json({ msg: 'Weather record not found' });
    }
    
    res.json(weather);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Weather record not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/weather
// @desc    Add a new weather record
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      time,
      temperature_2m_C,
      relative_humidity_2m_percent,
      dew_point_2m_C,
      apparent_temperature_C,
      precipitation_probability_percent,
      precipitation_mm,
      rain_mm,
      showers_mm,
      surface_pressure_hPa,
      visibility_m,
      cloud_cover_high_percent,
      cloud_cover_mid_percent,
      cloud_cover_low_percent
    } = req.body;
    
    // Check if record with this time already exists
    const existingRecord = await Weather.findOne({ time });
    
    if (existingRecord) {
      return res.status(400).json({ msg: 'Weather record for this time already exists' });
    }
    
    // Create new weather record
    const newWeather = new Weather({
      time,
      temperature_2m_C,
      relative_humidity_2m_percent,
      dew_point_2m_C,
      apparent_temperature_C,
      precipitation_probability_percent,
      precipitation_mm,
      rain_mm,
      showers_mm,
      surface_pressure_hPa,
      visibility_m,
      cloud_cover_high_percent,
      cloud_cover_mid_percent,
      cloud_cover_low_percent
    });
    
    const weather = await newWeather.save();
    
    res.json(weather);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/weather/:id
// @desc    Update a weather record
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const {
      time,
      temperature_2m_C,
      relative_humidity_2m_percent,
      dew_point_2m_C,
      apparent_temperature_C,
      precipitation_probability_percent,
      precipitation_mm,
      rain_mm,
      showers_mm,
      surface_pressure_hPa,
      visibility_m,
      cloud_cover_high_percent,
      cloud_cover_mid_percent,
      cloud_cover_low_percent
    } = req.body;
    
    // Check if record exists
    let weather = await Weather.findById(req.params.id);
    
    if (!weather) {
      return res.status(404).json({ msg: 'Weather record not found' });
    }
    
    // If time is changing, check if it conflicts with another record
    if (time && time !== weather.time) {
      const existingRecord = await Weather.findOne({ time });
      if (existingRecord && existingRecord._id.toString() !== req.params.id) {
        return res.status(400).json({ msg: 'Weather record for this time already exists' });
      }
    }
    
    // Build update object
    const weatherFields = {};
    if (time) weatherFields.time = time;
    if (temperature_2m_C !== undefined) weatherFields.temperature_2m_C = temperature_2m_C;
    if (relative_humidity_2m_percent !== undefined) weatherFields.relative_humidity_2m_percent = relative_humidity_2m_percent;
    if (dew_point_2m_C !== undefined) weatherFields.dew_point_2m_C = dew_point_2m_C;
    if (apparent_temperature_C !== undefined) weatherFields.apparent_temperature_C = apparent_temperature_C;
    if (precipitation_probability_percent !== undefined) weatherFields.precipitation_probability_percent = precipitation_probability_percent;
    if (precipitation_mm !== undefined) weatherFields.precipitation_mm = precipitation_mm;
    if (rain_mm !== undefined) weatherFields.rain_mm = rain_mm;
    if (showers_mm !== undefined) weatherFields.showers_mm = showers_mm;
    if (surface_pressure_hPa !== undefined) weatherFields.surface_pressure_hPa = surface_pressure_hPa;
    if (visibility_m !== undefined) weatherFields.visibility_m = visibility_m;
    if (cloud_cover_high_percent !== undefined) weatherFields.cloud_cover_high_percent = cloud_cover_high_percent;
    if (cloud_cover_mid_percent !== undefined) weatherFields.cloud_cover_mid_percent = cloud_cover_mid_percent;
    if (cloud_cover_low_percent !== undefined) weatherFields.cloud_cover_low_percent = cloud_cover_low_percent;
    
    // Update record
    weather = await Weather.findByIdAndUpdate(
      req.params.id,
      { $set: weatherFields },
      { new: true }
    );
    
    res.json(weather);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Weather record not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/weather/:id
// @desc    Delete a weather record
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const weather = await Weather.findById(req.params.id);
    
    if (!weather) {
      return res.status(404).json({ msg: 'Weather record not found' });
    }
    
    await weather.deleteOne();
    
    res.json({ msg: 'Weather record removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Weather record not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 