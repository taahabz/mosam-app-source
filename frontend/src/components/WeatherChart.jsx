import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  Box,
  Typography, 
  ToggleButtonGroup, 
  ToggleButton
} from '@mui/material';
import { formatTime } from '../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          borderRadius: 1,
          p: 1.5,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography
            key={`item-${index}`}
            variant="body2"
            sx={{ color: entry.color, fontWeight: 500 }}
          >
            {entry.name}: {entry.value}
            {entry.name === 'Temperature' && '°C'}
            {entry.name === 'Humidity' && '%'}
            {entry.name === 'Precipitation' && ' mm'}
            {entry.name === 'Pressure' && ' hPa'}
            {entry.name === 'Cloud Cover' && '%'}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const WeatherChart = ({ data, title }) => {
  const [chartType, setChartType] = useState('temperature');

  const handleChartTypeChange = (event, newChartType) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  // Format the data for the chart
  const chartData = data?.map(item => ({
    time: formatTime(item.time),
    temperature: item.temperature_2m_C,
    humidity: item.relative_humidity_2m_percent,
    precipitation: item.precipitation_mm,
    pressure: item.surface_pressure_hPa,
    cloudCover: (
      item.cloud_cover_high_percent + 
      item.cloud_cover_mid_percent + 
      item.cloud_cover_low_percent
    ) / 3
  }));

  // Define chart configurations based on the selected type
  const chartConfigs = {
    temperature: {
      dataKey: 'temperature',
      stroke: '#FF5722',
      fill: 'rgba(255, 87, 34, 0.2)',
      name: 'Temperature',
      label: 'Temperature (°C)',
      domain: ['dataMin - 5', 'dataMax + 5']
    },
    humidity: {
      dataKey: 'humidity',
      stroke: '#2196F3',
      fill: 'rgba(33, 150, 243, 0.2)',
      name: 'Humidity',
      label: 'Humidity (%)',
      domain: [0, 100]
    },
    precipitation: {
      dataKey: 'precipitation',
      stroke: '#03A9F4',
      fill: 'rgba(3, 169, 244, 0.2)',
      name: 'Precipitation',
      label: 'Precipitation (mm)',
      domain: [0, 'dataMax + 2']
    },
    pressure: {
      dataKey: 'pressure',
      stroke: '#9C27B0',
      fill: 'rgba(156, 39, 176, 0.2)',
      name: 'Pressure',
      label: 'Pressure (hPa)',
      domain: ['dataMin - 5', 'dataMax + 5']
    },
    cloudCover: {
      dataKey: 'cloudCover',
      stroke: '#9E9E9E',
      fill: 'rgba(158, 158, 158, 0.2)',
      name: 'Cloud Cover',
      label: 'Cloud Cover (%)',
      domain: [0, 100]
    }
  };

  const currentConfig = chartConfigs[chartType];

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 0 }}>
          {title || 'Weather Trends'}
        </Typography>
        
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
          aria-label="chart type"
          sx={{
            '& .MuiToggleButton-root': {
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'none',
              fontWeight: 500,
              '&.Mui-selected': {
                backgroundColor: 'rgba(97, 175, 254, 0.2)',
                color: '#fff',
                fontWeight: 600,
              },
              '&:hover': {
                backgroundColor: 'rgba(97, 175, 254, 0.1)',
              }
            }
          }}
        >
          <ToggleButton value="temperature" aria-label="temperature">
            Temperature
          </ToggleButton>
          <ToggleButton value="humidity" aria-label="humidity">
            Humidity
          </ToggleButton>
          <ToggleButton value="precipitation" aria-label="precipitation">
            Precipitation
          </ToggleButton>
          <ToggleButton value="pressure" aria-label="pressure">
            Pressure
          </ToggleButton>
          <ToggleButton value="cloudCover" aria-label="cloud cover">
            Cloud
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Box sx={{ width: '100%', height: 350 }}>
        {chartData?.length > 0 ? (
          <ResponsiveContainer>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="time" 
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
              />
              <YAxis 
                label={{ 
                  value: currentConfig.label, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: 'rgba(255, 255, 255, 0.7)', textAnchor: 'middle' }
                }}
                domain={currentConfig.domain}
                tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '10px',
                  opacity: 0.8
                }}
              />
              <defs>
                <linearGradient id={`color-${chartType}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.stroke} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={currentConfig.stroke} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={currentConfig.dataKey}
                name={currentConfig.name}
                stroke={currentConfig.stroke}
                fillOpacity={1}
                fill={`url(#color-${chartType})`}
                strokeWidth={2}
                activeDot={{ r: 8, stroke: currentConfig.stroke, strokeWidth: 2, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.2)',
              borderRadius: 2
            }}
          >
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              No data available for the selected period
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default WeatherChart; 