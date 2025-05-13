import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Button, 
  Paper, 
  Divider 
} from '@mui/material';
import { 
  ArrowForward as ArrowForwardIcon, 
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import WeatherCard from '../../components/WeatherCard';
import { useWeather } from '../../context/WeatherContext';
import { getLatestWeather, getWeatherByDate } from '../../services/api';
import { getCurrentDate, getDateDaysAgo, formatDate } from '../../utils/helpers';

const Home = () => {
  const { latestWeather, loading } = useWeather();
  const [forecastData, setForecastData] = useState([]);
  
  // Fetch forecast data for the next few days
  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        // Get data for the next 3 days (using the sample data we have)
        const today = getCurrentDate();
        const data = await getWeatherByDate(today);
        
        // Take only a few samples for display
        const samples = data.filter((item, index) => index % 8 === 0).slice(0, 3);
        setForecastData(samples);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    };
    
    fetchForecastData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Mosam Weather Forecast
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Real-time IoT weather data from ISB Weather Point
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* Current Weather Section */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              background: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
              color: 'white'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Current Weather
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {latestWeather && (
                  <Box sx={{ color: 'white' }}>
                    <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {Math.round(latestWeather.temperature_2m_C)}°C
                    </Typography>
                    <Typography variant="h6">
                      Humidity: {Math.round(latestWeather.relative_humidity_2m_percent)}%
                    </Typography>
                    <Typography variant="h6">
                      Precipitation: {latestWeather.precipitation_mm} mm
                    </Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/dashboard" 
                  size="large"
                  endIcon={<DashboardIcon />}
                  sx={{ 
                    mb: 2, 
                    bgcolor: 'rgba(255, 255, 255, 0.9)', 
                    color: '#0288d1',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 1)',
                    }
                  }}
                >
                  View Detailed Dashboard
                </Button>
                
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/trends" 
                  size="large"
                  endIcon={<TrendingUpIcon />}
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)', 
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      borderColor: 'white',
                    }
                  }}
                >
                  Analyze Weather Trends
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Forecast Section */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Forecast
          </Typography>
          <Grid container spacing={3}>
            {forecastData.map((data, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <WeatherCard weatherData={data} />
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              component={Link} 
              to="/dashboard" 
              endIcon={<ArrowForwardIcon />}
            >
              View Full Forecast
            </Button>
          </Box>
        </Grid>
        
        {/* About Section */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" gutterBottom>
            About Mosam Weather
          </Typography>
          <Typography variant="body1" paragraph>
            Mosam Weather provides accurate and up-to-date weather forecasts using real meteorological data. 
            Our platform offers detailed insights into temperature, humidity, precipitation, and other 
            important weather parameters.
          </Typography>
          <Typography variant="body1">
            Explore our dashboard for detailed weather information, analyze trends over time, 
            and get access to historical weather data.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 