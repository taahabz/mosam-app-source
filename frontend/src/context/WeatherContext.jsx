import { createContext, useState, useContext, useEffect } from 'react';
import { getLatestWeather, getWeatherData } from '../services/api';

const WeatherContext = createContext();

export const useWeather = () => {
  return useContext(WeatherContext);
};

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [latestWeather, setLatestWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch latest weather data
  const fetchLatestWeather = async () => {
    try {
      setLoading(true);
      const data = await getLatestWeather();
      setLatestWeather(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch latest weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all weather data
  const fetchAllWeatherData = async () => {
    try {
      setLoading(true);
      const data = await getWeatherData();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch and polling setup for real-time IoT monitoring
  useEffect(() => {
    // Initial fetch
    fetchLatestWeather();
    
    // Set up polling every 5 seconds for real-time updates
    const pollingInterval = setInterval(() => {
      fetchLatestWeather();
    }, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(pollingInterval);
  }, []);

  const value = {
    weatherData,
    latestWeather,
    loading,
    error,
    fetchLatestWeather,
    fetchAllWeatherData,
    setWeatherData
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext; 