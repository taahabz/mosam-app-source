import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Lock as LockIcon } from '@mui/icons-material';

// Simple password for admin access - in a real app, this would be handled by proper authentication
const ADMIN_PASSWORD = 'admin123';

const PasswordProtection = ({ children }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('adminAuthenticated') === 'true'
  );
  
  const location = useLocation();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={0} className="glass-effect" sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LockIcon sx={{ fontSize: 40, mr: 2, color: '#3a7bd5' }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Admin Access
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please enter the admin password to access this page.
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              error={error}
              helperText={error ? 'Incorrect password' : ''}
              autoFocus
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => window.history.back()}
                sx={{ borderRadius: 2 }}
              >
                Go Back
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ 
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #3a7bd5, #1a4b8e)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1a4b8e, #3a7bd5)',
                  }
                }}
              >
                Access Admin
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default PasswordProtection; 