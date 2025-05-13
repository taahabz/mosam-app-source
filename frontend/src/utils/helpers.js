// Format date to YYYY-MM-DD
export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format date and time to readable format
export const formatDateTime = (dateTimeStr) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(dateTimeStr).toLocaleDateString('en-US', options);
};

// Format time from ISO string (returns only the time part)
export const formatTime = (dateTimeStr) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateTimeStr).toLocaleTimeString('en-US', options);
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = () => {
  return formatDate(new Date());
};

// Get date from X days ago in YYYY-MM-DD format
export const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
};

// Get date from X days in the future in YYYY-MM-DD format
export const getDateDaysInFuture = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

// Convert temperature from Celsius to Fahrenheit
export const celsiusToFahrenheit = (celsius) => {
  return (celsius * 9/5) + 32;
};

// Round number to specified decimal places
export const roundToDecimal = (num, decimalPlaces = 1) => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
};

// Get weather condition based on parameters
export const getWeatherCondition = (temp, humidity, precipitation) => {
  if (precipitation > 5) return 'Heavy Rain';
  if (precipitation > 0.5) return 'Rain';
  if (precipitation > 0) return 'Light Rain';
  
  if (temp > 30) return 'Hot';
  if (temp < 10) return 'Cold';
  
  if (humidity > 80) return 'Humid';
  if (humidity < 30) return 'Dry';
  
  return 'Pleasant';
};

// Generate color based on temperature
export const getTemperatureColor = (temp) => {
  if (temp >= 30) return '#FF5722'; // Hot - Orange/Red
  if (temp >= 25) return '#FF9800'; // Warm - Orange
  if (temp >= 20) return '#FFC107'; // Mild - Amber
  if (temp >= 15) return '#8BC34A'; // Cool - Light Green
  if (temp >= 10) return '#03A9F4'; // Cold - Light Blue
  return '#2196F3'; // Very Cold - Blue
};

// Get date range options for filters
export const getDateRangeOptions = () => {
  return [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'next7days', label: 'Next 7 Days' },
    { value: 'next30days', label: 'Next 30 Days' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];
};

// Convert date range option to actual dates
export const getDateRangeFromOption = (option) => {
  const today = new Date();
  let startDate, endDate;
  
  switch (option) {
    case 'today':
      startDate = formatDate(today);
      endDate = formatDate(today);
      break;
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      startDate = formatDate(yesterday);
      endDate = formatDate(yesterday);
      break;
    case 'last7days':
      const last7 = new Date(today);
      last7.setDate(today.getDate() - 6);
      startDate = formatDate(last7);
      endDate = formatDate(today);
      break;
    case 'last30days':
      const last30 = new Date(today);
      last30.setDate(today.getDate() - 29);
      startDate = formatDate(last30);
      endDate = formatDate(today);
      break;
    case 'next7days':
      startDate = formatDate(today);
      const next7 = new Date(today);
      next7.setDate(today.getDate() + 6);
      endDate = formatDate(next7);
      break;
    case 'next30days':
      startDate = formatDate(today);
      const next30 = new Date(today);
      next30.setDate(today.getDate() + 29);
      endDate = formatDate(next30);
      break;
    case 'thisWeek':
      // Start of current week (Sunday)
      const startOfWeek = new Date(today);
      const dayOfWeek = today.getDay();
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      startDate = formatDate(startOfWeek);
      
      // End of current week (Saturday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endDate = formatDate(endOfWeek);
      break;
    case 'thisMonth':
      // Start of current month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate = formatDate(startOfMonth);
      
      // End of current month
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endDate = formatDate(endOfMonth);
      break;
    default:
      startDate = '';
      endDate = '';
  }
  
  return { startDate, endDate };
}; 