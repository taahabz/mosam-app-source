import { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Card, 
  CardContent, 
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import WeatherChart from '../../components/WeatherChart';
import DateRangeSelector from '../../components/DateRangeSelector';
import { getWeatherByDateRange, getHourlyStats } from '../../services/api';
import { getCurrentDate, getDateDaysAgo, formatDate } from '../../utils/helpers';

const Trends = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [hourlyStats, setHourlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(getDateDaysAgo(6));
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [availableDates, setAvailableDates] = useState([]);

  // Fetch weather data for the selected date range
  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch weather data for the date range
      const data = await getWeatherByDateRange(startDate, endDate);
      setWeatherData(data);
      
      // Extract unique dates from the data for the date selector
      const uniqueDates = [...new Set(data.map(item => item.time.substring(0, 10)))];
      setAvailableDates(uniqueDates);
      
      // Set the selected date to the first available date if not in the list
      if (!uniqueDates.includes(selectedDate)) {
        setSelectedDate(uniqueDates[0] || getCurrentDate());
      }
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedDate]);

  // Fetch hourly stats for the selected date
  const fetchHourlyStats = useCallback(async () => {
    if (!selectedDate) return;
    
    try {
      setLoading(true);
      const data = await getHourlyStats(selectedDate);
      setHourlyStats(data);
    } catch (err) {
      console.error(`Error fetching hourly stats for ${selectedDate}:`, err);
      setError(`Failed to fetch hourly statistics for ${selectedDate}.`);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  // Handle date range change
  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Handle selected date change
  const handleSelectedDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Fetch data when date range changes
  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // Fetch hourly stats when selected date changes
  useEffect(() => {
    if (selectedDate) {
      fetchHourlyStats();
    }
  }, [selectedDate, fetchHourlyStats]);

  // Format hourly stats for chart
  const formatHourlyStatsForChart = () => {
    return hourlyStats.map(stat => ({
      time: `${stat._id}:00`,
      temperature: stat.avgTemperature,
      humidity: stat.avgHumidity,
      precipitation: stat.totalPrecipitation
    }));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Weather Trends Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Analyze weather trends over time and view hourly statistics
        </Typography>
      </Box>

      {/* Date Range Selector */}
      <DateRangeSelector onDateRangeChange={handleDateRangeChange} />

      {/* Loading and Error States */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Grid container spacing={4}>
          {/* Overall Trends Chart */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Weather Trends for {startDate} to {endDate}
                </Typography>
                <WeatherChart data={weatherData} />
              </CardContent>
            </Card>
          </Grid>

          {/* Hourly Stats Section */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Hourly Statistics
                  </Typography>
                  
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="date-select-label">Select Date</InputLabel>
                    <Select
                      labelId="date-select-label"
                      id="date-select"
                      value={selectedDate}
                      label="Select Date"
                      onChange={handleSelectedDateChange}
                    >
                      {availableDates.map((date) => (
                        <MenuItem key={date} value={date}>
                          {date}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                {hourlyStats.length > 0 ? (
                  <WeatherChart 
                    data={formatHourlyStatsForChart()} 
                    title={`Hourly Weather Statistics for ${selectedDate}`}
                  />
                ) : (
                  <Typography variant="body1" align="center" sx={{ py: 4 }}>
                    No hourly data available for the selected date.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Trends; 