import { create } from 'zustand';
import {
  Policy,
  PolicyCategory,
  PolicyParameter,
  PopulationComposition,
  SimulationConfig,
  SimulationResults,
} from '../models/types';
import { simulationService } from '../services/simulationService';

// Default values for new policies
const DEFAULT_POLICY: Policy = {
  name: 'New Policy',
  category: 'green',
  parameters: {
    timeline: 'phased',
    funding: 'tax',
    targeting: 'universal',
    intensity: 5,
  },
  description: '',
};

// Default population composition
const DEFAULT_POPULATION_COMPOSITION: PopulationComposition = {
  economicClassDistribution: {
    'low-income': 33,
    'middle-income': 34,
    'high-income': 33,
  },
  workIdentityDistribution: {
    'manufacturing': 25,
    'tech': 25,
    'service': 25,
    'energy': 25,
  },
  ageDemographicDistribution: {
    'young': 33,
    'mid-career': 34,
    'pre-retirement': 33,
  },
  geographicDistribution: {
    'urban': 33,
    'suburban': 34,
    'rural': 33,
  },
};

interface SimulationStore {
  // Current policy being configured
  currentPolicy: Policy;
  updateCurrentPolicy: (policy: Partial<Policy>) => void;
  updatePolicyParameters: (parameters: Partial<PolicyParameter>) => void;
  setPolicyCategory: (category: PolicyCategory) => void;
  
  // Population configuration
  populationComposition: PopulationComposition;
  updatePopulationComposition: (composition: Partial<PopulationComposition>) => void;
  updateEconomicDistribution: (distribution: Record<string, number>) => void;
  updateWorkDistribution: (distribution: Record<string, number>) => void;
  updateAgeDistribution: (distribution: Record<string, number>) => void;
  updateGeographicDistribution: (distribution: Record<string, number>) => void;
  
  // Simulation settings
  agentCount: number;
  setAgentCount: (count: number) => void;
  
  // Simulation state
  isRunning: boolean;
  currentResults: SimulationResults | null;
  simulationHistory: SimulationResults[];
  
  // Simulation actions
  runSimulation: () => Promise<void>;
  saveResults: (results: SimulationResults) => void;
  clearResults: () => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  // Initial state
  currentPolicy: { ...DEFAULT_POLICY },
  populationComposition: { ...DEFAULT_POPULATION_COMPOSITION },
  agentCount: 100,
  isRunning: false,
  currentResults: null,
  simulationHistory: [],
  
  // Policy actions
  updateCurrentPolicy: (policyUpdate) => {
    set((state) => ({
      currentPolicy: { ...state.currentPolicy, ...policyUpdate },
    }));
  },
  
  updatePolicyParameters: (parametersUpdate) => {
    set((state) => ({
      currentPolicy: {
        ...state.currentPolicy,
        parameters: { ...state.currentPolicy.parameters, ...parametersUpdate },
      },
    }));
  },
  
  setPolicyCategory: (category) => {
    set((state) => ({
      currentPolicy: { ...state.currentPolicy, category },
    }));
  },
  
  // Population actions
  updatePopulationComposition: (compositionUpdate) => {
    set((state) => ({
      populationComposition: { ...state.populationComposition, ...compositionUpdate },
    }));
  },
  
  updateEconomicDistribution: (distribution) => {
    set((state) => ({
      populationComposition: {
        ...state.populationComposition,
        economicClassDistribution: {
          ...state.populationComposition.economicClassDistribution,
          ...distribution,
        },
      },
    }));
  },
  
  updateWorkDistribution: (distribution) => {
    set((state) => ({
      populationComposition: {
        ...state.populationComposition,
        workIdentityDistribution: {
          ...state.populationComposition.workIdentityDistribution,
          ...distribution,
        },
      },
    }));
  },
  
  updateAgeDistribution: (distribution) => {
    set((state) => ({
      populationComposition: {
        ...state.populationComposition,
        ageDemographicDistribution: {
          ...state.populationComposition.ageDemographicDistribution,
          ...distribution,
        },
      },
    }));
  },
  
  updateGeographicDistribution: (distribution) => {
    set((state) => ({
      populationComposition: {
        ...state.populationComposition,
        geographicDistribution: {
          ...state.populationComposition.geographicDistribution,
          ...distribution,
        },
      },
    }));
  },
  
  // Simulation settings
  setAgentCount: (count) => {
    set({ agentCount: count });
  },
  
  // Simulation actions
  runSimulation: async () => {
    const { currentPolicy, populationComposition, agentCount } = get();
    
    // Validate the policy
    if (!currentPolicy.name || !currentPolicy.description) {
      throw new Error('Policy name and description are required');
    }
    
    // Create the simulation config
    const config: SimulationConfig = {
      policy: currentPolicy,
      populationComposition,
      agentCount,
      createdAt: new Date(),
    };
    
    // Set the simulation as running
    set({ isRunning: true });
    
    try {
      // Run the simulation
      const results = await simulationService.runSimulation(config);
      
      // Update the state with results
      set({
        isRunning: false,
        currentResults: results,
      });
      
      // Save to history
      get().saveResults(results);
      
      return;
    } catch (error) {
      console.error('Error running simulation:', error);
      set({ isRunning: false });
      throw error;
    }
  },
  
  saveResults: (results) => {
    set((state) => ({
      simulationHistory: [results, ...state.simulationHistory],
    }));
  },
  
  clearResults: () => {
    set({ currentResults: null });
  },
}));
