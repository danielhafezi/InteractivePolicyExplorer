import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ mb: 2, fontSize: '6rem', color: 'primary.main' }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button variant="contained" color="primary" component={RouterLink} to="/">
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
