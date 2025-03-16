import { Box, Container, Typography, Paper, Grid, Divider } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
        About the Interactive Policy Explorer
      </Typography>
      
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary.main">
          Project Overview
        </Typography>
        <Typography paragraph>
          The Interactive Policy Explorer (IPE) is a web-based application that democratizes economic policy understanding by allowing users to explore and visualize the potential impacts of various policies across different socio-economic groups. Using LLM-powered agent-based modeling, the tool simulates how policies related to AI adoption and green economic transitions affect political polarization, work identity, and socioeconomic outcomes.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" component="h2" gutterBottom color="primary.main">
          Target Users
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Box component="ul" sx={{ pl: 4 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography>Policy educators and students in economic/political sciences</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography>Public policy researchers and think tanks</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography>Journalists covering economic policy</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box component="ul" sx={{ pl: 4 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography>Concerned citizens seeking to understand policy implications</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography>Policymakers wanting to communicate policy impacts visually</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" component="h2" gutterBottom color="primary.main">
          Key Value Proposition
        </Typography>
        <Typography paragraph>
          The IPE transforms complex economic policy discussions into intuitive visual simulations, making policy trade-offs transparent and accessible. By leveraging LLMs to simulate diverse human reactions, it provides a more nuanced view of policy impacts than traditional economic models, while remaining accessible to non-experts.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" component="h2" gutterBottom color="primary.main">
          Technology
        </Typography>
        <Typography paragraph>
          The Interactive Policy Explorer is built using a modern tech stack including React, TypeScript, Material UI, and D3.js for visualizations. The agent-based simulation is powered by Google's Gemini Flash 2 API, with the architecture designed to later incorporate multiple LLM perspectives including OpenAI and Anthropic models.
        </Typography>
      </Paper>
      
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary.main">
          Ethical Considerations
        </Typography>
        <Typography paragraph>
          We recognize the importance of ethical considerations in policy simulation tools. The Interactive Policy Explorer implements several measures to ensure responsible use:
        </Typography>
        
        <Box component="ul" sx={{ pl: 4 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Bias Mitigation</Typography>
            <Typography>Regular audits of LLM outputs for political or economic bias, transparent documentation of model limitations, and multiple perspective generation to avoid single viewpoint dominance.</Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Trust Building</Typography>
            <Typography>Clear citations for economic data sources, explicit marking of simulated vs. empirical data, and documentation of model assumptions and simplifications.</Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Responsible Use</Typography>
            <Typography>Educational context provided around results, disclaimers about simplified nature of simulations, and guidance against misinterpretation of results.</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutPage;
