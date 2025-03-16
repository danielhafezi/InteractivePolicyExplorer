import {
  SimulationConfig,
  SimulationResults,
  Agent,
  AgentResponse,
  PopulationComposition,
  EconomicClass,
  WorkIdentity,
  AgeDemographic,
  GeographicDistribution,
} from '../models/types';

import { llmService } from './llmService';

class SimulationService {
  /**
   * Runs a simulation with the given configuration
   */
  async runSimulation(config: SimulationConfig): Promise<SimulationResults> {
    try {
      // 1. Generate agents based on population composition
      const agents = this.generateAgentPopulation(config.populationComposition, config.agentCount);
      
      // 2. Generate agent responses using LLM service
      const agentResponses: Record<string, AgentResponse> = {};
      
      // In a real implementation, we would handle this with proper batching and rate limiting
      // For now, we'll use Promise.all for simplicity
      const responsePromises = agents.map(async (agent) => {
        const response = await llmService.generateAgentResponse(config.policy, agent);
        return { agentId: agent.id, response };
      });
      
      const responses = await Promise.all(responsePromises);
      
      // Convert array of responses to record by agent ID
      responses.forEach(({ agentId, response }) => {
        agentResponses[agentId] = response;
      });
      
      // 3. Compute aggregate metrics
      const aggregateMetrics = this.computeAggregateMetrics(agents, agentResponses);
      
      // 4. Build and return simulation results
      const simulationId = this.generateSimulationId();
      
      return {
        simulationId,
        config,
        agentResponses,
        aggregateMetrics,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error running simulation:', error);
      throw new Error('Failed to run simulation');
    }
  }
  
  /**
   * Generates a population of agents based on the specified composition
   */
  private generateAgentPopulation(composition: PopulationComposition, count: number): Agent[] {
    const agents: Agent[] = [];
    
    for (let i = 0; i < count; i++) {
      const agent: Agent = {
        id: `agent-${i}`,
        economicClass: this.sampleFromDistribution(composition.economicClassDistribution),
        workIdentity: this.sampleFromDistribution(composition.workIdentityDistribution),
        ageDemographic: this.sampleFromDistribution(composition.ageDemographicDistribution),
        geographicDistribution: this.sampleFromDistribution(composition.geographicDistribution),
      };
      
      agents.push(agent);
    }
    
    return agents;
  }
  
  /**
   * Samples a value from a distribution object
   */
  private sampleFromDistribution<T extends string>(distribution: Record<T, number>): T {
    const entries = Object.entries(distribution) as [T, number][];
    const total = entries.reduce((sum, [_, value]) => sum + value, 0);
    
    // Normalize if the total isn't exactly 100
    const normalizedEntries = entries.map(
      ([key, value]) => [key, value / total] as [T, number]
    );
    
    // Create cumulative distribution
    let cumulativeProb = 0;
    const cumulativeDistribution = normalizedEntries.map(([key, prob]) => {
      cumulativeProb += prob;
      return [key, cumulativeProb] as [T, number];
    });
    
    // Sample from distribution
    const randomValue = Math.random();
    for (const [key, cumProb] of cumulativeDistribution) {
      if (randomValue <= cumProb) {
        return key;
      }
    }
    
    // Fallback to the last item (should not happen unless distribution is empty)
    return cumulativeDistribution[cumulativeDistribution.length - 1][0];
  }
  
  /**
   * Computes aggregate metrics from individual agent responses
   */
  private computeAggregateMetrics(agents: Agent[], agentResponses: Record<string, AgentResponse>) {
    // Group agents by economic class
    const economicClassGroups: Record<EconomicClass, Agent[]> = {
      'low-income': [],
      'middle-income': [],
      'high-income': [],
    };
    
    // Group agents by work identity
    const workIdentityGroups: Record<WorkIdentity, Agent[]> = {
      'manufacturing': [],
      'tech': [],
      'service': [],
      'energy': [],
    };
    
    // Populate groups
    agents.forEach(agent => {
      economicClassGroups[agent.economicClass].push(agent);
      workIdentityGroups[agent.workIdentity].push(agent);
    });
    
    // Calculate average economic impact by economic class
    const economicImpact: Record<EconomicClass, number> = {
      'low-income': 0,
      'middle-income': 0,
      'high-income': 0,
    };
    
    Object.entries(economicClassGroups).forEach(([className, classAgents]) => {
      const classImpacts = classAgents.map(
        agent => agentResponses[agent.id]?.economic_assessment.personal_impact || 0
      );
      
      const average = classImpacts.length > 0
        ? classImpacts.reduce((sum, impact) => sum + impact, 0) / classImpacts.length
        : 0;
      
      economicImpact[className as EconomicClass] = average;
    });
    
    // Calculate average support level by work identity
    const supportLevel: Record<WorkIdentity, number> = {
      'manufacturing': 0,
      'tech': 0,
      'service': 0,
      'energy': 0,
    };
    
    Object.entries(workIdentityGroups).forEach(([workId, workAgents]) => {
      const workSupports = workAgents.map(
        agent => agentResponses[agent.id]?.political_reaction.support_level || 0
      );
      
      const average = workSupports.length > 0
        ? workSupports.reduce((sum, support) => sum + support, 0) / workSupports.length
        : 0;
      
      supportLevel[workId as WorkIdentity] = average;
    });
    
    // Calculate polarization index (standard deviation of support levels)
    const allSupportLevels = agents.map(
      agent => agentResponses[agent.id]?.political_reaction.support_level || 0
    );
    
    const averageSupportLevel = allSupportLevels.reduce((sum, level) => sum + level, 0) / allSupportLevels.length;
    
    const squaredDifferences = allSupportLevels.map(level => Math.pow(level - averageSupportLevel, 2));
    const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / allSupportLevels.length;
    const polarizationIndex = Math.sqrt(variance);
    
    return {
      economicImpact,
      supportLevel,
      polarizationIndex,
    };
  }
  
  /**
   * Generates a unique simulation ID
   */
  private generateSimulationId(): string {
    return `sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}

export const simulationService = new SimulationService();

export default SimulationService;
