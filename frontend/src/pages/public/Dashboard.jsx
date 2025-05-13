import { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent,
  Alert,
  CircularProgress,
  Paper,
  Grid
} from '@mui/material';
import WeatherCard from '../../components/WeatherCard';
import WeatherChart from '../../components/WeatherChart';
import WeatherStats from '../../components/WeatherStats';
import DateRangeSelector from '../../components/DateRangeSelector';
import { getWeatherByDateRange, getWeatherStats } from '../../services/api';
import { getCurrentDate, getDateDaysAgo } from '../../utils/helpers';

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [weatherStats, setWeatherStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(getDateDaysAgo(6));
  const [endDate, setEndDate] = useState(getCurrentDate());

  // Fetch weather data for the selected date range
  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch weather data
      const data = await getWeatherByDateRange(startDate, endDate);
      setWeatherData(data);
      
      // Fetch weather statistics
      const stats = await getWeatherStats(startDate, endDate);
      setWeatherStats(stats);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  // Handle date range change
  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Fetch data when date range changes
  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return (
    <Container maxWidth="lg">
      <Box 
        sx={{ 
          mt: 4, 
          mb: 6,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            backgroundImage: 'linear-gradient(135deg, #3a7bd5, #1a4b8e)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          IoT Weather Dashboard
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 400,
            opacity: 0.8
          }}
        >
          Real-time monitoring of IoT weather data from ISB Weather Point
        </Typography>
      </Box>

      {/* Date Range Selector */}
      <Paper 
        elevation={0}
        className="glass-effect"
        sx={{ p: 3, mb: 4, borderRadius: 2 }}
      >
        <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
      </Paper>

      {/* Loading and Error States */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#3a7bd5' }} />
        </Box>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Grid container spacing={4}>
          {/* Weather Statistics */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              className="glass-effect"
              sx={{ p: 3, borderRadius: 2 }}
            >
              <WeatherStats stats={weatherStats} />
            </Paper>
          </Grid>

          {/* Weather Chart */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              className="glass-effect"
              sx={{ p: 3, borderRadius: 2 }}
            >
              <WeatherChart 
                data={weatherData} 
                title="Weather Trends for Selected Period" 
              />
            </Paper>
          </Grid>

          {/* Daily Weather Cards */}
          <Grid item xs={12}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                mt: 2, 
                mb: 3, 
                fontWeight: 600,
                pl: 1,
                borderLeft: '4px solid #3a7bd5'
              }}
            >
              Detailed Weather Data
            </Typography>
            <Grid container spacing={3}>
              {weatherData.length > 0 ? (
                weatherData
                  .filter((_, index) => index % 6 === 0) // Show every 6th record to avoid overcrowding
                  .map((data, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <WeatherCard weatherData={data} />
                    </Grid>
                  ))
              ) : (
                <Grid item xs={12}>
                  <Paper 
                    elevation={0}
                    className="glass-effect"
                    sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      No weather data available for the selected date range.
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard; 