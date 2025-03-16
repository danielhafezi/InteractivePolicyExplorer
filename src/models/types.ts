// Policy Types
export type PolicyCategory = 'green' | 'ai' | 'combined';

export type PolicyParameter = {
  timeline: 'immediate' | 'phased';
  funding: 'tax' | 'debt' | 'mixed';
  targeting: 'universal' | 'sector-specific';
  intensity: number; // 1-10 scale
};

export interface Policy {
  id?: string;
  name: string;
  category: PolicyCategory;
  parameters: PolicyParameter;
  description: string;
}

// Agent/Population Types
export type EconomicClass = 'low-income' | 'middle-income' | 'high-income';
export type WorkIdentity = 'manufacturing' | 'tech' | 'service' | 'energy';
export type AgeDemographic = 'young' | 'mid-career' | 'pre-retirement';
export type GeographicDistribution = 'urban' | 'suburban' | 'rural';

export interface Agent {
  id: string;
  economicClass: EconomicClass;
  workIdentity: WorkIdentity;
  ageDemographic: AgeDemographic;
  geographicDistribution: GeographicDistribution;
  // Additional attributes can be added as needed
}

export interface PopulationComposition {
  economicClassDistribution: Record<EconomicClass, number>; // Percentages (0-100)
  workIdentityDistribution: Record<WorkIdentity, number>;
  ageDemographicDistribution: Record<AgeDemographic, number>;
  geographicDistribution: Record<GeographicDistribution, number>;
}

// Simulation Types
export interface SimulationConfig {
  id?: string;
  policy: Policy;
  populationComposition: PopulationComposition;
  agentCount: number;
  seed?: number; // For reproducibility
  createdAt?: Date;
}

// Agent Response Schema (from LLM)
export interface AgentResponse {
  economic_assessment: {
    personal_impact: number; // -5 to 5
    community_impact: number; // -5 to 5
    rationale: string;
  };
  political_reaction: {
    support_level: number; // -5 to 5
    key_concerns: string[];
    values_alignment: number; // -5 to 5
  };
  behavioral_response: {
    actions: string[];
    information_seeking: boolean;
    social_sharing: boolean;
  };
  narrative: string;
}

// Simulation Results
export interface SimulationResults {
  simulationId: string;
  config: SimulationConfig;
  agentResponses: Record<string, AgentResponse>; // Agent ID -> Response
  aggregateMetrics: {
    economicImpact: Record<EconomicClass, number>;
    supportLevel: Record<WorkIdentity, number>;
    polarizationIndex: number;
    // Additional aggregate metrics
  };
  timestamp: Date;
}
