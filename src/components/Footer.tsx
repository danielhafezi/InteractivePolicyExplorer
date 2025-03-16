import { Box, Container, Typography, Link, Stack } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Interactive Policy Explorer
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link href="#" variant="body2" color="text.secondary">
              Terms
            </Link>
            <Link href="#" variant="body2" color="text.secondary">
              Privacy
            </Link>
            <Link href="#" variant="body2" color="text.secondary">
              Contact
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
