import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Tab,
  Tabs,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useSimulationStore } from '../store/simulationStore';
import { EconomicClass, WorkIdentity } from '../models/types';

// Simple bar chart component (in a real app, this would use D3.js or similar)
const BarChart = ({
  data,
  title,
  maxValue = 5,
  minValue = -5,
}: {
  data: Record<string, number>;
  title: string;
  maxValue?: number;
  minValue?: number;
}) => {
  // Normalize values to 0-100% for rendering
  const range = maxValue - minValue;
  const normalize = (value: number) => ((value - minValue) / range) * 100;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {Object.entries(data).map(([key, value]) => {
        const normalizedValue = normalize(value);
        const color = value > 0 ? 'primary.main' : 'error.main';
        const label = key.replace('-', ' ');

        return (
          <Box key={key} sx={{ mb: 1.5 }}>
            <Typography variant="body2" sx={{ mb: 0.5, textTransform: 'capitalize' }}>
              {label}: {value.toFixed(1)}
            </Typography>
            <Box sx={{ width: '100%', bgcolor: 'grey.100', borderRadius: 1, height: 8 }}>
              <Box
                sx={{
                  width: `${normalizedValue}%`,
                  bgcolor: color,
                  height: 8,
                  borderRadius: 1,
                  transition: 'width 1s ease-in-out',
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const { currentResults, isRunning, clearResults } = useSimulationStore();
  const [activeTab, setActiveTab] = useState(0);

  // Redirect to simulation page if no results are available
  useEffect(() => {
    if (!currentResults && !isRunning) {
      navigate('/simulation');
    }
  }, [currentResults, isRunning, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleNewSimulation = () => {
    clearResults();
    navigate('/simulation');
  };

  // Loading state
  if (isRunning) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <CircularProgress size={60} sx={{ mb: 4 }} />
          <Typography variant="h5" gutterBottom>
            Running Simulation
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Please wait while we simulate the impact of your policy across different population segments.
            This may take up to 30 seconds.
          </Typography>
        </Box>
      </Container>
    );
  }

  // No results state (should redirect, but just in case)
  if (!currentResults) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ my: 4 }}>
          No simulation results available. Please create a new simulation.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/simulation')}>
          Create Simulation
        </Button>
      </Container>
    );
  }

  const { policy, populationComposition, agentCount } = currentResults.config;
  const { economicImpact, supportLevel, polarizationIndex } = currentResults.aggregateMetrics;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 1 }}>
        Simulation Results
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Showing impact analysis for "{policy.name}"
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="result tabs">
          <Tab label="Overview" />
          <Tab label="Economic Impact" />
          <Tab label="Political Response" />
          <Tab label="Agent Profiles" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Summary
              </Typography>
              <Typography paragraph>
                This simulation shows the projected impacts of {policy.name} on a population of {agentCount} agents
                with diverse socioeconomic backgrounds. The policy, which falls under the
                {policy.category === 'green' && ' green transition'}
                {policy.category === 'ai' && ' AI/automation'}
                {policy.category === 'combined' && ' combined green transition and AI/automation'} category,
                has varying effects across different population segments.
              </Typography>

              <Alert
                severity={polarizationIndex > 3 ? 'warning' : 'info'}
                sx={{ mt: 2, mb: 3 }}
              >
                <Typography variant="subtitle2">
                  Polarization Index: {polarizationIndex.toFixed(2)} / 5.0
                </Typography>
                {polarizationIndex > 3 ? (
                  <Typography variant="body2">
                    This policy generates significant polarization across population segments.
                  </Typography>
                ) : (
                  <Typography variant="body2">
                    This policy shows relatively moderate levels of polarization.
                  </Typography>
                )}
              </Alert>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Key Insights
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    {Object.entries(economicImpact).reduce(
                      (highest, [className, impact]) =>
                        highest.impact > impact
                          ? highest
                          : { class: className, impact },
                      { class: '', impact: -Infinity }
                    ).class === 'low-income' && 'Low-income'}
                    {Object.entries(economicImpact).reduce(
                      (highest, [className, impact]) =>
                        highest.impact > impact
                          ? highest
                          : { class: className, impact },
                      { class: '', impact: -Infinity }
                    ).class === 'middle-income' && 'Middle-income'}
                    {Object.entries(economicImpact).reduce(
                      (highest, [className, impact]) =>
                        highest.impact > impact
                          ? highest
                          : { class: className, impact },
                      { class: '', impact: -Infinity }
                    ).class === 'high-income' && 'High-income'} earners see the most
                    positive economic impact from this policy.
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    The {Object.entries(supportLevel).reduce(
                      (highest, [workId, support]) =>
                        highest.support > support
                          ? highest
                          : { work: workId, support },
                      { work: '', support: -Infinity }
                    ).work} sector shows the strongest support for this policy.
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    {Object.entries(economicImpact).reduce(
                      (lowest, [className, impact]) =>
                        lowest.impact < impact ? lowest : { class: className, impact },
                      { class: '', impact: Infinity }
                    ).class === 'low-income' && 'Low-income'}
                    {Object.entries(economicImpact).reduce(
                      (lowest, [className, impact]) =>
                        lowest.impact < impact ? lowest : { class: className, impact },
                      { class: '', impact: Infinity }
                    ).class === 'middle-income' && 'Middle-income'}
                    {Object.entries(economicImpact).reduce(
                      (lowest, [className, impact]) =>
                        lowest.impact < impact ? lowest : { class: className, impact },
                      { class: '', impact: Infinity }
                    ).class === 'high-income' && 'High-income'} earners may face challenges
                    adapting to this policy change.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Policy Details
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Name</Typography>
                <Typography variant="body1">{policy.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Category</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {policy.category.replace('-', ' ')} Policies
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Implementation</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {policy.parameters.timeline} ({policy.parameters.intensity}/10 intensity)
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Funding</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {policy.parameters.funding.replace('-', ' ')}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Targeting</Typography>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {policy.parameters.targeting.replace('-', ' ')}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Description</Typography>
                <Typography variant="body2">{policy.description}</Typography>
              </Box>
            </Paper>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNewSimulation}
                sx={{ mx: 1 }}
              >
                New Simulation
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Economic Impact Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Economic Impact by Class
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                This chart shows the projected economic impact of the policy on different economic classes,
                from negative (-5) to positive (5).
              </Typography>
              <BarChart
                data={economicImpact}
                title="Personal Economic Impact"
                minValue={-5}
                maxValue={5}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Impact Analysis
              </Typography>
              <Typography paragraph>
                The economic impact analysis shows how different economic classes are projected to
                experience the policy's effects on their personal financial situations and job
                prospects.
              </Typography>

              <Typography variant="h6" gutterBottom>
                Winners and Losers
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {Object.entries(economicImpact)
                  .sort((a, b) => b[1] - a[1])
                  .map(([className, impact]) => (
                    <Box component="li" key={className} sx={{ mb: 1 }}>
                      <Typography sx={{ textTransform: 'capitalize' }}>
                        <strong>{className.replace('-', ' ')}:</strong>{' '}
                        {impact > 0
                          ? `Positive impact (${impact.toFixed(1)})`
                          : impact < 0
                          ? `Negative impact (${impact.toFixed(1)})`
                          : 'Neutral impact'}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Political Response Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Support Level by Work Identity
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                This chart shows the projected political support for the policy across different
                work identities, from opposition (-5) to support (5).
              </Typography>
              <BarChart
                data={supportLevel}
                title="Policy Support Level"
                minValue={-5}
                maxValue={5}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Polarization Analysis
              </Typography>
              <Typography paragraph>
                The political response analysis examines how different work identity groups are
                likely to respond to the policy, and whether it creates or reduces polarization.
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Polarization Index: {polarizationIndex.toFixed(2)} / 5.0
                </Typography>
                <Box sx={{ width: '100%', bgcolor: 'grey.100', borderRadius: 1, height: 10 }}>
                  <Box
                    sx={{
                      width: `${(polarizationIndex / 5) * 100}%`,
                      bgcolor:
                        polarizationIndex > 3
                          ? 'error.main'
                          : polarizationIndex > 1.5
                          ? 'warning.main'
                          : 'success.main',
                      height: 10,
                      borderRadius: 1,
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {polarizationIndex > 3
                    ? 'High polarization - significant disagreement across groups'
                    : polarizationIndex > 1.5
                    ? 'Moderate polarization - some disagreement across groups'
                    : 'Low polarization - general consensus across groups'}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Strongest Support and Opposition
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {Object.entries(supportLevel)
                  .sort((a, b) => b[1] - a[1])
                  .map(([workId, support], index) => (
                    <Box component="li" key={workId} sx={{ mb: 1 }}>
                      <Typography sx={{ textTransform: 'capitalize' }}>
                        <strong>{workId.replace('-', ' ')}:</strong>{' '}
                        {support > 0
                          ? `Supportive (${support.toFixed(1)})`
                          : support < 0
                          ? `Oppositional (${support.toFixed(1)})`
                          : 'Neutral'}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Agent Profiles Tab */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Sample Agent Responses
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            These are sample responses from individual agents in the simulation, showing how different
            people might react to the policy based on their socioeconomic profiles.
          </Typography>

          <Grid container spacing={3}>
            {Object.entries(currentResults.agentResponses)
              .slice(0, 6)
              .map(([agentId, response]) => {
                const agent = Object.values(currentResults.config.populationComposition);
                return (
                  <Grid item xs={12} md={6} lg={4} key={agentId}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Agent Profile
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          A {Math.random() > 0.5 ? 'female' : 'male'}{' '}
                          {Math.floor(25 + Math.random() * 40)}-year-old{' '}
                          {agentId.includes('manufacturing') ? 'manufacturing worker' :
                            agentId.includes('tech') ? 'tech professional' :
                            agentId.includes('service') ? 'service worker' : 'energy sector employee'}{' '}
                          from a {agentId.includes('urban') ? 'urban' :
                            agentId.includes('suburban') ? 'suburban' : 'rural'} area.
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="subtitle2">Their Response:</Typography>
                        <Typography variant="body2" paragraph>
                          {response.narrative}
                        </Typography>
                        <Typography variant="subtitle2">Key Concerns:</Typography>
                        <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
                          {response.political_reaction.key_concerns.map((concern, index) => (
                            <Box component="li" key={index}>
                              <Typography variant="body2">{concern}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ResultsPage;
