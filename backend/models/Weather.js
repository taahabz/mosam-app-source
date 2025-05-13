const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  temperature_2m_C: {
    type: Number,
    required: true
  },
  relative_humidity_2m_percent: {
    type: Number,
    required: true
  },
  dew_point_2m_C: {
    type: Number,
    required: true
  },
  apparent_temperature_C: {
    type: Number,
    required: true
  },
  precipitation_probability_percent: {
    type: Number,
    required: true
  },
  precipitation_mm: {
    type: Number,
    required: true
  },
  rain_mm: {
    type: Number,
    required: true
  },
  showers_mm: {
    type: Number,
    required: true
  },
  surface_pressure_hPa: {
    type: Number,
    required: true
  },
  visibility_m: {
    type: Number,
    required: true
  },
  cloud_cover_high_percent: {
    type: Number,
    required: true
  },
  cloud_cover_mid_percent: {
    type: Number,
    required: true
  },
  cloud_cover_low_percent: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Weather', WeatherSchema); 