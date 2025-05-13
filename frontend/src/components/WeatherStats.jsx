import React from 'react';
import { 
  Typography, 
  Box,
  Grid
} from '@mui/material';
import { 
  Thermostat as ThermostatIcon,
  WaterDrop as WaterDropIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { roundToDecimal, getTemperatureColor } from '../utils/helpers';

const StatItem = ({ icon, label, value, unit, color }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      p: 2,
      borderRadius: 2,
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      height: '100%',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1)',
        transform: 'translateY(-3px)'
      }
    }}
  >
    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {React.cloneElement(icon, { sx: { ...icon.props.sx, fontSize: '2.5rem' } })}
    </Box>
    <Box>
      <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5, fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ color, fontWeight: 600 }}>
        {value} {unit}
      </Typography>
    </Box>
  </Box>
);

const WeatherStats = ({ stats }) => {
  if (!stats) {
    return null;
  }

  const {
    avgTemperature,
    minTemperature,
    maxTemperature,
    avgHumidity,
    totalPrecipitation,
    recordCount
  } = stats;

  const avgTempColor = getTemperatureColor(avgTemperature);
  const minTempColor = getTemperatureColor(minTemperature);
  const maxTempColor = getTemperatureColor(maxTemperature);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Weather Statistics
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.7 }}>
            Based on {recordCount} records
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid md={4} sm={6} xs={12}>
          <StatItem
            icon={<ThermostatIcon sx={{ color: avgTempColor }} />}
            label="Average Temperature"
            value={roundToDecimal(avgTemperature)}
            unit="°C"
            color={avgTempColor}
          />
        </Grid>
        
        <Grid md={4} sm={6} xs={12}>
          <StatItem
            icon={<TrendingDownIcon sx={{ color: minTempColor }} />}
            label="Minimum Temperature"
            value={roundToDecimal(minTemperature)}
            unit="°C"
            color={minTempColor}
          />
        </Grid>
        
        <Grid md={4} sm={6} xs={12}>
          <StatItem
            icon={<TrendingUpIcon sx={{ color: maxTempColor }} />}
            label="Maximum Temperature"
            value={roundToDecimal(maxTemperature)}
            unit="°C"
            color={maxTempColor}
          />
        </Grid>
        
        <Grid md={6} sm={6} xs={12}>
          <StatItem
            icon={<WaterDropIcon sx={{ color: '#2196F3' }} />}
            label="Average Humidity"
            value={roundToDecimal(avgHumidity)}
            unit="%"
            color="#2196F3"
          />
        </Grid>
        
        <Grid md={6} sm={6} xs={12}>
          <StatItem
            icon={<WaterDropIcon sx={{ color: '#03A9F4' }} />}
            label="Total Precipitation"
            value={roundToDecimal(totalPrecipitation)}
            unit="mm"
            color="#03A9F4"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default WeatherStats; 