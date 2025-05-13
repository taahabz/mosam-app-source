import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Button,
  Container,
  CssBaseline, 
  Divider, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography,
  useMediaQuery,
  useTheme,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Map as MapIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  WbSunny as WbSunnyIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const publicNavItems = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Weather Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { name: 'Weather Trends', path: '/trends', icon: <TrendingUpIcon /> },
  { name: 'Weather Map', path: '/map', icon: <MapIcon /> },
  { name: 'About', path: '/about', icon: <InfoIcon /> }
];

const adminNavItems = [
  { name: 'Admin Dashboard', path: '/admin', icon: <AdminIcon /> },
  { name: 'Manage Weather', path: '/admin/data', icon: <SettingsIcon /> }
];

export default function Layout({ children }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isAdmin = location.pathname.startsWith('/admin');

  const drawer = (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
        <img src="/logo.png" alt="Mosam Weather Logo" style={{ height: 50 }} />
      </Box>
      <Divider />
      <List>
        {publicNavItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              selected={isActive(item.path)}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(97, 175, 254, 0.2)',
                  borderRight: '4px solid #3a7bd5',
                  '&:hover': {
                    backgroundColor: 'rgba(97, 175, 254, 0.3)',
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(97, 175, 254, 0.1)',
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? '#3a7bd5' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{ 
                  fontWeight: isActive(item.path) ? 600 : 400,
                  fontSize: '0.95rem'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {adminNavItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              selected={isActive(item.path)}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(97, 175, 254, 0.2)',
                  borderRight: '4px solid #3a7bd5',
                  '&:hover': {
                    backgroundColor: 'rgba(97, 175, 254, 0.3)',
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(97, 175, 254, 0.1)',
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? '#3a7bd5' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{ 
                  fontWeight: isActive(item.path) ? 600 : 400,
                  fontSize: '0.95rem'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            <WbSunnyIcon sx={{ mr: 1, color: '#FFD700' }} />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
              {isAdmin ? 'Admin Panel' : 'Weather Dashboard'}
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile && (
              <>
                <Button 
                  color="inherit" 
                  sx={{ 
                    mx: 1, 
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onClick={() => navigate('/dashboard')}
                >
                  Weather
                </Button>
                <Button 
                  color="inherit" 
                  sx={{ 
                    mx: 1, 
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  onClick={() => navigate('/trends')}
                >
                  Trends
                </Button>
                <Button 
                  variant="contained" 
                  sx={{ 
                    ml: 2, 
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 500,
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  Subscribe
                </Button>
              </>
            )}
            <IconButton color="inherit" sx={{ ml: 1 }}>
              <NotificationsIcon />
            </IconButton>
            <Avatar 
              sx={{ 
                ml: 2, 
                width: 35, 
                height: 35,
                background: 'linear-gradient(135deg, #3a7bd5, #1a4b8e)'
              }}
            >
              U
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'rgba(26, 75, 142, 0.8)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'rgba(26, 75, 142, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid rgba(255, 255, 255, 0.18)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          maxWidth: '100%',
          overflowX: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        <Toolbar /> {/* This is for spacing below the AppBar */}
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
} 