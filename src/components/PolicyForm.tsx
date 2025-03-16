import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Slider,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import { Policy, PolicyCategory, PolicyParameter } from '../models/types';

interface PolicyFormProps {
  policy: Policy;
  onUpdatePolicy: (policy: Partial<Policy>) => void;
  onUpdateParameters: (parameters: Partial<PolicyParameter>) => void;
  onSetCategory: (category: PolicyCategory) => void;
}

const PolicyForm = ({
  policy,
  onUpdatePolicy,
  onUpdateParameters,
  onSetCategory,
}: PolicyFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    if (name === 'name' && !value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: 'Policy name is required' }));
      return false;
    }
    if (name === 'description' && !value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: 'Policy description is required' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
    return true;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
    onUpdatePolicy({ [name]: value });
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    onSetCategory(e.target.value as PolicyCategory);
  };

  const handleParameterChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    onUpdateParameters({ [name]: value });
  };

  const handleIntensityChange = (_: Event, value: number | number[]) => {
    onUpdateParameters({ intensity: value as number });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Policy Configuration
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Policy Name"
            name="name"
            value={policy.name}
            onChange={handleTextChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Policy Category</InputLabel>
            <Select
              value={policy.category}
              label="Policy Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="green">Green Transition Policies</MenuItem>
              <MenuItem value="ai">AI/Automation Policies</MenuItem>
              <MenuItem value="combined">Combined Approaches</MenuItem>
            </Select>
            <FormHelperText>
              {policy.category === 'green' && 'Policies focused on environmental sustainability'}
              {policy.category === 'ai' && 'Policies addressing AI and automation challenges'}
              {policy.category === 'combined' && 'Integrated approaches addressing both transitions'}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Policy Description"
            name="description"
            value={policy.description}
            onChange={handleTextChange}
            error={!!errors.description}
            helperText={errors.description || 'Describe the policy in detail'}
            margin="normal"
            multiline
            rows={4}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Implementation Timeline</InputLabel>
            <Select
              name="timeline"
              value={policy.parameters.timeline}
              label="Implementation Timeline"
              onChange={handleParameterChange}
            >
              <MenuItem value="immediate">Immediate Implementation</MenuItem>
              <MenuItem value="phased">Phased Implementation</MenuItem>
            </Select>
            <FormHelperText>
              {policy.parameters.timeline === 'immediate' ? 'Rapid deployment' : 'Gradual rollout'}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Funding Mechanism</InputLabel>
            <Select
              name="funding"
              value={policy.parameters.funding}
              label="Funding Mechanism"
              onChange={handleParameterChange}
            >
              <MenuItem value="tax">Tax-Based</MenuItem>
              <MenuItem value="debt">Debt-Financed</MenuItem>
              <MenuItem value="mixed">Mixed Funding</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Targeting Approach</InputLabel>
            <Select
              name="targeting"
              value={policy.parameters.targeting}
              label="Targeting Approach"
              onChange={handleParameterChange}
            >
              <MenuItem value="universal">Universal</MenuItem>
              <MenuItem value="sector-specific">Sector-Specific</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ mt: 4 }}>
            <Typography gutterBottom>Policy Intensity</Typography>
            <Slider
              value={policy.parameters.intensity}
              onChange={handleIntensityChange}
              step={1}
              marks
              min={1}
              max={10}
              valueLabelDisplay="auto"
              aria-labelledby="policy-intensity-slider"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Moderate
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Aggressive
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PolicyForm;
