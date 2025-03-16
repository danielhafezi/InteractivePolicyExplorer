import { Box, Typography, Button, Grid, Paper, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 2,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Interactive Policy Explorer
          </Typography>
          <Typography variant="h5" component="h2" sx={{ mb: 4, maxWidth: '800px' }}>
            Visualize the potential impacts of economic policies across different socio-economic groups using LLM-powered simulations
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/simulation"
            sx={{ mr: 2 }}
          >
            Start a Simulation
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            component={RouterLink}
            to="/about"
            sx={{ borderColor: 'white', color: 'white' }}
          >
            Learn More
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" component="h3" gutterBottom color="primary.main">
                Policy Simulation
              </Typography>
              <Typography paragraph>
                Explore the impacts of green transition policies, AI/automation policies, and integrated policy packages on different population segments.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" component="h3" gutterBottom color="primary.main">
                Population Modeling
              </Typography>
              <Typography paragraph>
                Customize agent profiles representing diverse socioeconomic groups, work identities, age demographics, and geographic distributions.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" component="h3" gutterBottom color="primary.main">
                LLM-Powered Insights
              </Typography>
              <Typography paragraph>
                LLMs simulate agent responses to policies based on economic self-interest, value systems, social influences, and political identity.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to explore policy impacts?
          </Typography>
          <Typography paragraph sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
            Start simulating policy scenarios now and discover how different population segments may respond to various economic policies.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/simulation"
          >
            Start a Simulation
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
