import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider
} from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About Mosam Weather
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Learn more about our weather forecasting platform and the data we provide
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              Mosam Weather aims to provide accurate, reliable, and easy-to-understand weather 
              forecasts and historical weather data. Our platform is designed to help users make 
              informed decisions based on weather conditions and trends.
            </Typography>
            <Typography variant="body1">
              We collect data from various meteorological sources and present it in a user-friendly 
              interface, making it accessible to everyone from casual users to weather enthusiasts 
              and professionals.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Our Data
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Weather station"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Data Collection
                  </Typography>
                  <Typography variant="body2">
                    Our weather data is collected from reliable meteorological sources, 
                    including weather stations, satellites, and radar systems. We ensure 
                    that our data is accurate and up-to-date.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Data analysis"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Data Analysis
                  </Typography>
                  <Typography variant="body2">
                    We process and analyze weather data to provide meaningful insights 
                    and forecasts. Our algorithms consider various factors to ensure 
                    the highest possible accuracy in our predictions.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={2}>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Data visualization"
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Data Visualization
                  </Typography>
                  <Typography variant="body2">
                    We present weather data in an intuitive and visually appealing way, 
                    making it easy for users to understand current conditions, forecasts, 
                    and historical trends at a glance.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ mt: 4 }}>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions, feedback, or suggestions, please feel free to contact us. 
            We're always looking to improve our service and provide the best possible weather 
            information to our users.
          </Typography>
          <Typography variant="body1">
            Email: info@mosamweather.com<br />
            Phone: +1 (123) 456-7890
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About; 