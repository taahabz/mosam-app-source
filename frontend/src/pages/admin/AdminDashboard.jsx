import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Card, 
  CardContent, 
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Storage as StorageIcon,
  DataObject as DataObjectIcon,
  DateRange as DateRangeIcon,
  Update as UpdateIcon
} from '@mui/icons-material';
import { getWeatherData } from '../../services/api';
import { formatDate, formatDateTime } from '../../utils/helpers';
import AdminHeader from '../../components/AdminHeader';

const AdminDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRecords: 0,
    dateRange: { start: '', end: '' },
    lastUpdated: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getWeatherData();
        setWeatherData(data);
        
        // Calculate stats
        if (data.length > 0) {
          const sortedByDate = [...data].sort((a, b) => new Date(a.time) - new Date(b.time));
          const startDate = sortedByDate[0].time;
          const endDate = sortedByDate[sortedByDate.length - 1].time;
          
          setStats({
            totalRecords: data.length,
            dateRange: { 
              start: startDate.substring(0, 10), 
              end: endDate.substring(0, 10) 
            },
            lastUpdated: new Date().toISOString()
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to fetch weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Get unique dates from weather data
  const getUniqueDates = () => {
    const dates = [...new Set(weatherData.map(item => item.time.substring(0, 10)))];
    return dates.sort();
  };

  // Count records per date
  const getRecordsPerDate = () => {
    const recordsPerDate = {};
    weatherData.forEach(item => {
      const date = item.time.substring(0, 10);
      recordsPerDate[date] = (recordsPerDate[date] || 0) + 1;
    });
    return recordsPerDate;
  };

  const uniqueDates = getUniqueDates();
  const recordsPerDate = getRecordsPerDate();

  return (
    <Container maxWidth="lg">
      <AdminHeader title="IoT Admin Dashboard" />
      
      <Box sx={{ mb: 6 }}>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage and monitor your IoT weather data from ISB Weather Point
        </Typography>
      </Box>

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
          {/* Stats Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <StorageIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6">
                        Total Records
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {stats.totalRecords}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DateRangeIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6">
                        Date Range
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      From: <strong>{stats.dateRange.start}</strong>
                    </Typography>
                    <Typography variant="body1">
                      To: <strong>{stats.dateRange.end}</strong>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <UpdateIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="h6">
                        Last Updated
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {formatDateTime(stats.lastUpdated)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Data Summary */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Data Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Available Dates ({uniqueDates.length})
                  </Typography>
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <List dense>
                      {uniqueDates.map((date, index) => (
                        <React.Fragment key={date}>
                          <ListItem>
                            <ListItemIcon>
                              <DateRangeIcon />
                            </ListItemIcon>
                            <ListItemText 
                              primary={date} 
                              secondary={`${recordsPerDate[date]} records`} 
                            />
                          </ListItem>
                          {index < uniqueDates.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Data Structure
                  </Typography>
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <DataObjectIcon />
                        </ListItemIcon>
                        <ListItemText primary="time" secondary="Timestamp (ISO format)" />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <DataObjectIcon />
                        </ListItemIcon>
                        <ListItemText primary="temperature_2m_C" secondary="Temperature in Celsius" />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <DataObjectIcon />
                        </ListItemIcon>
                        <ListItemText primary="relative_humidity_2m_percent" secondary="Humidity percentage" />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <DataObjectIcon />
                        </ListItemIcon>
                        <ListItemText primary="precipitation_mm" secondary="Precipitation in mm" />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemIcon>
                          <DataObjectIcon />
                        </ListItemIcon>
                        <ListItemText primary="..." secondary="And more weather parameters" />
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default AdminDashboard; 