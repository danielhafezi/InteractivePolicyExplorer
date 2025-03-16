import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useSimulationStore } from '../store/simulationStore';
import PolicyForm from '../components/PolicyForm';
import PopulationForm from '../components/PopulationForm';

const steps = ['Policy Configuration', 'Population Modeling', 'Run Simulation'];

const SimulationPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const {
    currentPolicy,
    updateCurrentPolicy,
    updatePolicyParameters,
    setPolicyCategory,
    populationComposition,
    updateEconomicDistribution,
    updateWorkDistribution,
    updateAgeDistribution,
    updateGeographicDistribution,
    agentCount,
    setAgentCount,
    isRunning,
    runSimulation,
  } = useSimulationStore();

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      if (!currentPolicy.name.trim() || !currentPolicy.description.trim()) {
        setError('Please fill in all required fields in the policy configuration.');
        return;
      }
    }

    // If we're on the last step, run the simulation
    if (activeStep === steps.length - 1) {
      handleRunSimulation();
      return;
    }

    setError(null);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError(null);
  };

  const handleRunSimulation = async () => {
    setError(null);

    try {
      await runSimulation();
      navigate('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred running the simulation');
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Create Policy Simulation
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {activeStep === 0 && (
        <PolicyForm
          policy={currentPolicy}
          onUpdatePolicy={updateCurrentPolicy}
          onUpdateParameters={updatePolicyParameters}
          onSetCategory={setPolicyCategory}
        />
      )}

      {activeStep === 1 && (
        <PopulationForm
          populationComposition={populationComposition}
          agentCount={agentCount}
          onUpdateEconomicDistribution={updateEconomicDistribution}
          onUpdateWorkDistribution={updateWorkDistribution}
          onUpdateAgeDistribution={updateAgeDistribution}
          onUpdateGeographicDistribution={updateGeographicDistribution}
          onSetAgentCount={setAgentCount}
        />
      )}

      {activeStep === 2 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Simulation Review
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">Policy Summary</Typography>
            <Typography>Name: {currentPolicy.name}</Typography>
            <Typography>Category: {currentPolicy.category}</Typography>
            <Typography>Description: {currentPolicy.description}</Typography>
            <Typography>Population Size: {agentCount} agents</Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            When you run this simulation, our system will use LLM-powered agent-based modeling to simulate
            how your policy would affect different socioeconomic groups. This process takes approximately
            30 seconds to complete.
          </Alert>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0 || isRunning}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color={activeStep === steps.length - 1 ? 'secondary' : 'primary'}
          onClick={handleNext}
          disabled={isRunning}
          startIcon={isRunning && <CircularProgress size={20} color="inherit" />}
        >
          {activeStep === steps.length - 1
            ? isRunning
              ? 'Running Simulation...'
              : 'Run Simulation'
            : 'Next'}
        </Button>
      </Box>
    </Container>
  );
};

export default SimulationPage;
