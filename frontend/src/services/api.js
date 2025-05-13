import axios from 'axios';

//  const API_URL = 'http://localhost:5000/api';   for local

const API_URL = 'https://mosambackend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Weather data endpoints
export const getWeatherData = async () => {
  try {
    const response = await api.get('/weather');
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getLatestWeather = async () => {
  try {
    const response = await api.get('/weather/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest weather data:', error);
    throw error;
  }
};

export const getWeatherByDate = async (date) => {
  try {
    const response = await api.get(`/weather/date/${date}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather data for date ${date}:`, error);
    throw error;
  }
};

export const getWeatherByDateRange = async (startDate, endDate) => {
  try {
    const response = await api.get(`/weather/range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather data for range ${startDate} to ${endDate}:`, error);
    throw error;
  }
};

export const getFilteredWeather = async (filters) => {
  try {
    // Convert filters object to query string
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const response = await api.get(`/weather/filter?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered weather data:', error);
    throw error;
  }
};

export const getWeatherStats = async (startDate, endDate) => {
  try {
    const response = await api.get(`/weather/stats?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather stats for range ${startDate} to ${endDate}:`, error);
    throw error;
  }
};

export const getHourlyStats = async (date) => {
  try {
    const response = await api.get(`/weather/hourly-stats/${date}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching hourly stats for date ${date}:`, error);
    throw error;
  }
};

// Admin endpoints for CRUD operations
export const getWeatherById = async (id) => {
  try {
    const response = await api.get(`/weather/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather data with id ${id}:`, error);
    throw error;
  }
};

export const createWeatherRecord = async (weatherData) => {
  try {
    const response = await api.post('/weather', weatherData);
    return response.data;
  } catch (error) {
    console.error('Error creating weather record:', error);
    throw error;
  }
};

export const updateWeatherRecord = async (id, weatherData) => {
  try {
    const response = await api.put(`/weather/${id}`, weatherData);
    return response.data;
  } catch (error) {
    console.error(`Error updating weather record with id ${id}:`, error);
    throw error;
  }
};

export const deleteWeatherRecord = async (id) => {
  try {
    const response = await api.delete(`/weather/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting weather record with id ${id}:`, error);
    throw error;
  }
};

export default api; 
