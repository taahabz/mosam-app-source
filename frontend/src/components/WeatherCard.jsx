import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider,
  Grid
} from '@mui/material';
import { 
  Thermostat as ThermostatIcon,
  WaterDrop as WaterDropIcon,
  AirOutlined as WindIcon,
  Visibility as VisibilityIcon,
  Cloud as CloudIcon
} from '@mui/icons-material';
import { formatDateTime, roundToDecimal, getWeatherCondition, getTemperatureColor } from '../utils/helpers';

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) {
    return null;
  }

  const {
    time,
    temperature_2m_C,
    relative_humidity_2m_percent,
    apparent_temperature_C,
    precipitation_mm,
    visibility_m,
    cloud_cover_high_percent,
    cloud_cover_mid_percent,
    cloud_cover_low_percent
  } = weatherData;

  const weatherCondition = getWeatherCondition(
    temperature_2m_C,
    relative_humidity_2m_percent,
    precipitation_mm
  );

  const tempColor = getTemperatureColor(temperature_2m_C);

  const totalCloudCover = (
    cloud_cover_high_percent + 
    cloud_cover_mid_percent + 
    cloud_cover_low_percent
  ) / 3;

  return (
    <Card 
      elevation={0} 
      className="glass-effect"
      sx={{ 
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 40px rgba(31, 38, 135, 0.4)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
          {formatDateTime(time)}
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ color: tempColor, fontWeight: 'bold' }}>
          {weatherCondition}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ThermostatIcon sx={{ mr: 1, color: tempColor, fontSize: '2rem' }} />
          <Typography variant="h3" sx={{ fontWeight: 600, color: tempColor }}>
            {roundToDecimal(temperature_2m_C)}°C
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ opacity: 0.8, mb: 2 }}>
          Feels like {roundToDecimal(apparent_temperature_C)}°C
        </Typography>
        
        <Divider sx={{ my: 2, opacity: 0.2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WaterDropIcon sx={{ mr: 1, color: '#2196F3' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Humidity: {roundToDecimal(relative_humidity_2m_percent)}%
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WaterDropIcon sx={{ mr: 1, color: '#03A9F4' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Precip: {roundToDecimal(precipitation_mm)} mm
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VisibilityIcon sx={{ mr: 1, color: '#757575' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Visibility: {(visibility_m / 1000).toFixed(1)} km
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CloudIcon sx={{ mr: 1, color: '#9E9E9E' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Cloud: {roundToDecimal(totalCloudCover)}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherCard; 