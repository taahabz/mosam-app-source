import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Paper, 
  Button, 
  TextField, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { 
  getWeatherData, 
  getWeatherById, 
  createWeatherRecord, 
  updateWeatherRecord, 
  deleteWeatherRecord 
} from '../../services/api';
import { formatDateTime } from '../../utils/helpers';
import AdminHeader from '../../components/AdminHeader';

const ManageData = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formData, setFormData] = useState({
    time: '',
    temperature_2m_C: '',
    relative_humidity_2m_percent: '',
    dew_point_2m_C: '',
    apparent_temperature_C: '',
    precipitation_probability_percent: '',
    precipitation_mm: '',
    rain_mm: '',
    showers_mm: '',
    surface_pressure_hPa: '',
    visibility_m: '',
    cloud_cover_high_percent: '',
    cloud_cover_mid_percent: '',
    cloud_cover_low_percent: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch weather data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getWeatherData();
        setWeatherData(data);
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

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle dialog open for adding new record
  const handleAddNew = () => {
    setCurrentRecord(null);
    setFormData({
      time: new Date().toISOString().substring(0, 16),
      temperature_2m_C: '',
      relative_humidity_2m_percent: '',
      dew_point_2m_C: '',
      apparent_temperature_C: '',
      precipitation_probability_percent: '0',
      precipitation_mm: '0',
      rain_mm: '0',
      showers_mm: '0',
      surface_pressure_hPa: '',
      visibility_m: '',
      cloud_cover_high_percent: '0',
      cloud_cover_mid_percent: '0',
      cloud_cover_low_percent: '0'
    });
    setOpenDialog(true);
  };

  // Handle dialog open for editing record
  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const record = await getWeatherById(id);
      setCurrentRecord(record);
      
      // Format time for datetime-local input
      const formattedTime = record.time.substring(0, 16);
      
      setFormData({
        ...record,
        time: formattedTime
      });
      
      setOpenDialog(true);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching record:', err);
      setSnackbar({
        open: true,
        message: 'Failed to fetch record details.',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  // Handle dialog open for deleting record
  const handleDeleteDialog = (record) => {
    setCurrentRecord(record);
    setOpenDeleteDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Convert string values to numbers
      const numericFormData = {
        ...formData,
        temperature_2m_C: parseFloat(formData.temperature_2m_C),
        relative_humidity_2m_percent: parseFloat(formData.relative_humidity_2m_percent),
        dew_point_2m_C: parseFloat(formData.dew_point_2m_C),
        apparent_temperature_C: parseFloat(formData.apparent_temperature_C),
        precipitation_probability_percent: parseFloat(formData.precipitation_probability_percent),
        precipitation_mm: parseFloat(formData.precipitation_mm),
        rain_mm: parseFloat(formData.rain_mm),
        showers_mm: parseFloat(formData.showers_mm),
        surface_pressure_hPa: parseFloat(formData.surface_pressure_hPa),
        visibility_m: parseFloat(formData.visibility_m),
        cloud_cover_high_percent: parseFloat(formData.cloud_cover_high_percent),
        cloud_cover_mid_percent: parseFloat(formData.cloud_cover_mid_percent),
        cloud_cover_low_percent: parseFloat(formData.cloud_cover_low_percent)
      };
      
      // Format time to ISO string
      const formattedTime = new Date(formData.time).toISOString();
      numericFormData.time = formattedTime;
      
      if (currentRecord?._id) {
        // Update existing record
        await updateWeatherRecord(currentRecord._id, numericFormData);
        setSnackbar({
          open: true,
          message: 'Record updated successfully!',
          severity: 'success'
        });
      } else {
        // Create new record
        await createWeatherRecord(numericFormData);
        setSnackbar({
          open: true,
          message: 'Record created successfully!',
          severity: 'success'
        });
      }
      
      // Refresh data
      const data = await getWeatherData();
      setWeatherData(data);
      
      // Close dialog
      setOpenDialog(false);
    } catch (err) {
      console.error('Error saving record:', err);
      setSnackbar({
        open: true,
        message: 'Failed to save record. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteWeatherRecord(currentRecord._id);
      
      // Refresh data
      const data = await getWeatherData();
      setWeatherData(data);
      
      setSnackbar({
        open: true,
        message: 'Record deleted successfully!',
        severity: 'success'
      });
      
      // Close dialog
      setOpenDeleteDialog(false);
    } catch (err) {
      console.error('Error deleting record:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete record. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  // Filter data based on search term
  const filteredData = weatherData.filter(item => 
    item.time.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="lg">
      <AdminHeader title="Manage IoT Weather Data" />
      
      <Box sx={{ mb: 6 }}>
        <Typography variant="body1" color="text.secondary" paragraph>
          Add, edit, or delete IoT weather records from ISB Weather Point
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
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Search by Date"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ width: 250, mr: 2 }}
              />
              <SearchIcon color="action" />
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
            >
              Add New Record
            </Button>
          </Box>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Temperature (°C)</TableCell>
                  <TableCell>Humidity (%)</TableCell>
                  <TableCell>Precipitation (mm)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{formatDateTime(row.time)}</TableCell>
                    <TableCell>{row.temperature_2m_C}</TableCell>
                    <TableCell>{row.relative_humidity_2m_percent}</TableCell>
                    <TableCell>{row.precipitation_mm}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleEdit(row._id)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteDialog(row)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Edit/Add Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentRecord ? 'Edit Weather Record' : 'Add New Weather Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time"
                type="datetime-local"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Temperature (°C)"
                type="number"
                name="temperature_2m_C"
                value={formData.temperature_2m_C}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Humidity (%)"
                type="number"
                name="relative_humidity_2m_percent"
                value={formData.relative_humidity_2m_percent}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dew Point (°C)"
                type="number"
                name="dew_point_2m_C"
                value={formData.dew_point_2m_C}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apparent Temperature (°C)"
                type="number"
                name="apparent_temperature_C"
                value={formData.apparent_temperature_C}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Precipitation Probability (%)"
                type="number"
                name="precipitation_probability_percent"
                value={formData.precipitation_probability_percent}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Precipitation (mm)"
                type="number"
                name="precipitation_mm"
                value={formData.precipitation_mm}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rain (mm)"
                type="number"
                name="rain_mm"
                value={formData.rain_mm}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Showers (mm)"
                type="number"
                name="showers_mm"
                value={formData.showers_mm}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Surface Pressure (hPa)"
                type="number"
                name="surface_pressure_hPa"
                value={formData.surface_pressure_hPa}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Visibility (m)"
                type="number"
                name="visibility_m"
                value={formData.visibility_m}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="High Cloud Cover (%)"
                type="number"
                name="cloud_cover_high_percent"
                value={formData.cloud_cover_high_percent}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Mid Cloud Cover (%)"
                type="number"
                name="cloud_cover_mid_percent"
                value={formData.cloud_cover_mid_percent}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Low Cloud Cover (%)"
                type="number"
                name="cloud_cover_low_percent"
                value={formData.cloud_cover_low_percent}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the weather record for {currentRecord && formatDateTime(currentRecord.time)}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageData; 