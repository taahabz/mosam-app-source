import { Box, Button, Typography } from '@mui/material';
import { ExitToApp as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication from localStorage
    localStorage.removeItem('adminAuthenticated');
    
    // Navigate to home page
    navigate('/');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 4,
      pb: 2,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      
      <Button
        variant="outlined"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{ 
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default AdminHeader; 