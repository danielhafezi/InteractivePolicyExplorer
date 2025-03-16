import {
  Paper,
  Typography,
  Grid,
  Slider,
  Box,
  FormControl,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import { PopulationComposition } from '../models/types';
import { useState, useEffect } from 'react';

interface PopulationFormProps {
  populationComposition: PopulationComposition;
  agentCount: number;
  onUpdateEconomicDistribution: (distribution: Record<string, number>) => void;
  onUpdateWorkDistribution: (distribution: Record<string, number>) => void;
  onUpdateAgeDistribution: (distribution: Record<string, number>) => void;
  onUpdateGeographicDistribution: (distribution: Record<string, number>) => void;
  onSetAgentCount: (count: number) => void;
}

const PopulationForm = ({
  populationComposition,
  agentCount,
  onUpdateEconomicDistribution,
  onUpdateWorkDistribution,
  onUpdateAgeDistribution,
  onUpdateGeographicDistribution,
  onSetAgentCount,
}: PopulationFormProps) => {
  // Local state for each distribution slider
  const [economicDist, setEconomicDist] = useState({
    'low-income': populationComposition.economicClassDistribution['low-income'],
    'middle-income': populationComposition.economicClassDistribution['middle-income'],
    'high-income': populationComposition.economicClassDistribution['high-income'],
  });

  const [workDist, setWorkDist] = useState({
    'manufacturing': populationComposition.workIdentityDistribution['manufacturing'],
    'tech': populationComposition.workIdentityDistribution['tech'],
    'service': populationComposition.workIdentityDistribution['service'],
    'energy': populationComposition.workIdentityDistribution['energy'],
  });

  const [ageDist, setAgeDist] = useState({
    'young': populationComposition.ageDemographicDistribution['young'],
    'mid-career': populationComposition.ageDemographicDistribution['mid-career'],
    'pre-retirement': populationComposition.ageDemographicDistribution['pre-retirement'],
  });

  const [geoDist, setGeoDist] = useState({
    'urban': populationComposition.geographicDistribution['urban'],
    'suburban': populationComposition.geographicDistribution['suburban'],
    'rural': populationComposition.geographicDistribution['rural'],
  });

  // Update parent state when sliders change
  useEffect(() => {
    onUpdateEconomicDistribution(economicDist);
  }, [economicDist, onUpdateEconomicDistribution]);

  useEffect(() => {
    onUpdateWorkDistribution(workDist);
  }, [workDist, onUpdateWorkDistribution]);

  useEffect(() => {
    onUpdateAgeDistribution(ageDist);
  }, [ageDist, onUpdateAgeDistribution]);

  useEffect(() => {
    onUpdateGeographicDistribution(geoDist);
  }, [geoDist, onUpdateGeographicDistribution]);

  // Handlers for slider changes
  const handleEconomicChange = (name: string) => (event: Event, value: number | number[]) => {
    const newValue = value as number;
    setEconomicDist((prev) => {
      const others = Object.entries(prev).filter(([key]) => key !== name);
      const remainingTotal = others.reduce((sum, [_, value]) => sum + value, 0);
      
      // Adjust other values proportionally
      if (remainingTotal > 0) {
        const factor = (100 - newValue) / remainingTotal;
        const adjusted = Object.fromEntries(
          others.map(([key, val]) => [key, Math.round(val * factor)])
        );
        return { ...adjusted, [name]: newValue };
      }
      
      // Handle edge case
      return { ...prev, [name]: newValue };
    });
  };

  const handleWorkChange = (name: string) => (event: Event, value: number | number[]) => {
    const newValue = value as number;
    setWorkDist((prev) => {
      const others = Object.entries(prev).filter(([key]) => key !== name);
      const remainingTotal = others.reduce((sum, [_, value]) => sum + value, 0);
      
      // Adjust other values proportionally
      if (remainingTotal > 0) {
        const factor = (100 - newValue) / remainingTotal;
        const adjusted = Object.fromEntries(
          others.map(([key, val]) => [key, Math.round(val * factor)])
        );
        return { ...adjusted, [name]: newValue };
      }
      
      // Handle edge case
      return { ...prev, [name]: newValue };
    });
  };

  const handleAgeChange = (name: string) => (event: Event, value: number | number[]) => {
    const newValue = value as number;
    setAgeDist((prev) => {
      const others = Object.entries(prev).filter(([key]) => key !== name);
      const remainingTotal = others.reduce((sum, [_, value]) => sum + value, 0);
      
      // Adjust other values proportionally
      if (remainingTotal > 0) {
        const factor = (100 - newValue) / remainingTotal;
        const adjusted = Object.fromEntries(
          others.map(([key, val]) => [key, Math.round(val * factor)])
        );
        return { ...adjusted, [name]: newValue };
      }
      
      // Handle edge case
      return { ...prev, [name]: newValue };
    });
  };

  const handleGeoChange = (name: string) => (event: Event, value: number | number[]) => {
    const newValue = value as number;
    setGeoDist((prev) => {
      const others = Object.entries(prev).filter(([key]) => key !== name);
      const remainingTotal = others.reduce((sum, [_, value]) => sum + value, 0);
      
      // Adjust other values proportionally
      if (remainingTotal > 0) {
        const factor = (100 - newValue) / remainingTotal;
        const adjusted = Object.fromEntries(
          others.map(([key, val]) => [key, Math.round(val * factor)])
        );
        return { ...adjusted, [name]: newValue };
      }
      
      // Handle edge case
      return { ...prev, [name]: newValue };
    });
  };

  // Handler for agent count change
  const handleAgentCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      onSetAgentCount(value);
    }
  };

  // Reset to equal distribution
  const resetToEqual = () => {
    setEconomicDist({ 'low-income': 33, 'middle-income': 34, 'high-income': 33 });
    setWorkDist({ 'manufacturing': 25, 'tech': 25, 'service': 25, 'energy': 25 });
    setAgeDist({ 'young': 33, 'mid-career': 34, 'pre-retirement': 33 });
    setGeoDist({ 'urban': 33, 'suburban': 34, 'rural': 33 });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Population Modeling
        </Typography>
        <Button variant="outlined" size="small" onClick={resetToEqual}>
          Reset to Equal Distribution
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <TextField
            type="number"
            label="Agent Count"
            value={agentCount}
            onChange={handleAgentCountChange}
            fullWidth
            inputProps={{ min: 10, max: 1000, step: 10 }}
            helperText="Number of simulated individuals (10-1000)"
            margin="normal"
          />
        </Grid>

        {/* Economic Class Distribution */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Economic Class Distribution
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Low Income: {economicDist['low-income']}%</Typography>
              <Slider
                value={economicDist['low-income']}
                onChange={handleEconomicChange('low-income')}
                aria-label="Low Income"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Middle Income: {economicDist['middle-income']}%</Typography>
              <Slider
                value={economicDist['middle-income']}
                onChange={handleEconomicChange('middle-income')}
                aria-label="Middle Income"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>High Income: {economicDist['high-income']}%</Typography>
              <Slider
                value={economicDist['high-income']}
                onChange={handleEconomicChange('high-income')}
                aria-label="High Income"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Work Identity Distribution */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Work Identity Distribution
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography gutterBottom>Manufacturing: {workDist['manufacturing']}%</Typography>
              <Slider
                value={workDist['manufacturing']}
                onChange={handleWorkChange('manufacturing')}
                aria-label="Manufacturing"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography gutterBottom>Tech: {workDist['tech']}%</Typography>
              <Slider
                value={workDist['tech']}
                onChange={handleWorkChange('tech')}
                aria-label="Tech"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography gutterBottom>Service: {workDist['service']}%</Typography>
              <Slider
                value={workDist['service']}
                onChange={handleWorkChange('service')}
                aria-label="Service"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography gutterBottom>Energy: {workDist['energy']}%</Typography>
              <Slider
                value={workDist['energy']}
                onChange={handleWorkChange('energy')}
                aria-label="Energy"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Age Demographic Distribution */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Age Demographic Distribution
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Young Workers: {ageDist['young']}%</Typography>
              <Slider
                value={ageDist['young']}
                onChange={handleAgeChange('young')}
                aria-label="Young Workers"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Mid-Career: {ageDist['mid-career']}%</Typography>
              <Slider
                value={ageDist['mid-career']}
                onChange={handleAgeChange('mid-career')}
                aria-label="Mid-Career"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Pre-Retirement: {ageDist['pre-retirement']}%</Typography>
              <Slider
                value={ageDist['pre-retirement']}
                onChange={handleAgeChange('pre-retirement')}
                aria-label="Pre-Retirement"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Geographic Distribution */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Geographic Distribution
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Urban: {geoDist['urban']}%</Typography>
              <Slider
                value={geoDist['urban']}
                onChange={handleGeoChange('urban')}
                aria-label="Urban"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Suburban: {geoDist['suburban']}%</Typography>
              <Slider
                value={geoDist['suburban']}
                onChange={handleGeoChange('suburban')}
                aria-label="Suburban"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Rural: {geoDist['rural']}%</Typography>
              <Slider
                value={geoDist['rural']}
                onChange={handleGeoChange('rural')}
                aria-label="Rural"
                valueLabelDisplay="auto"
                min={0}
                max={100}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PopulationForm;
