import { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Stack,
  Typography,
  Grid
} from '@mui/material';
import { 
  DateRange as DateRangeIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { 
  getDateRangeOptions, 
  getDateRangeFromOption, 
  getCurrentDate, 
  getDateDaysAgo,
  getDateDaysInFuture
} from '../utils/helpers';

const DateRangeSelector = ({ onDateRangeChange }) => {
  const [rangeType, setRangeType] = useState('last7days');
  const [startDate, setStartDate] = useState(getDateDaysAgo(6));
  const [endDate, setEndDate] = useState(getCurrentDate());
  
  // Get future date limit for max attribute (1 year from now)
  const maxDate = getDateDaysInFuture(365);
  
  const dateRangeOptions = getDateRangeOptions();
  
  // Update dates when range type changes
  useEffect(() => {
    if (rangeType !== 'custom') {
      const { startDate: start, endDate: end } = getDateRangeFromOption(rangeType);
      setStartDate(start);
      setEndDate(end);
      onDateRangeChange(start, end);
    }
  }, [rangeType, onDateRangeChange]);
  
  // Handle custom date changes
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (rangeType === 'custom' && newStartDate && endDate) {
      onDateRangeChange(newStartDate, endDate);
    }
  };
  
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (rangeType === 'custom' && startDate && newEndDate) {
      onDateRangeChange(startDate, newEndDate);
    }
  };
  
  const handleRangeTypeChange = (e) => {
    setRangeType(e.target.value);
  };
  
  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid md={4} sm={12} xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, md: 0 } }}>
            <DateRangeIcon sx={{ mr: 1, color: '#3a7bd5' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Select Date Range
            </Typography>
          </Box>
        </Grid>
        
        <Grid md={8} sm={12} xs={12}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                }
              },
              '& .MuiInputLabel-root': {
                fontWeight: 500
              }
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="date-range-select-label">Date Range</InputLabel>
              <Select
                labelId="date-range-select-label"
                id="date-range-select"
                value={rangeType}
                label="Date Range"
                onChange={handleRangeTypeChange}
                startAdornment={
                  <CalendarTodayIcon sx={{ ml: 1, mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} fontSize="small" />
                }
              >
                {dateRangeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {rangeType === 'custom' && (
              <>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: maxDate }}
                  fullWidth
                  sx={{
                    '& input': {
                      color: 'rgba(255, 255, 255, 0.87)',
                    }
                  }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ max: maxDate }}
                  fullWidth
                  sx={{
                    '& input': {
                      color: 'rgba(255, 255, 255, 0.87)',
                    }
                  }}
                />
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DateRangeSelector; 