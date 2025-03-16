import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
let genAI: GoogleGenerativeAI;

export function initGemini(apiKey: string) {
  genAI = new GoogleGenerativeAI(apiKey);
}

// Define types for socio-economic groups
export type SocioEconomicGroup = {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
};

// Define types for policy
export type Policy = {
  category: string;
  parameters: Record<string, number | string>;
  customDescription?: string;
};

// Define types for simulation response
export type SimulationResponse = {
  economicImpact: {
    personalImpactScore: number;
    communityImpactScore: number;
    rationale: string;
  };
  politicalReaction: {
    supportLevel: number;
    keyConcerns: string[];
    valuesAlignment: number;
  };
  behavioralResponse: {
    likelyActions: string[];
    adaptationStrategies: string[];
  };
  narrative: string;
};

// Define predefined socio-economic groups
export const socioEconomicGroups: SocioEconomicGroup[] = [
  {
    id: 'low-income',
    name: 'Low-Income Worker',
    description: 'Service industry or gig economy worker with limited economic resources',
    systemPrompt: `You are simulating a low-income worker in the service industry or gig economy.
Your background includes unstable employment, limited savings, and concerns about job security.
Your political views are pragmatic and focused on immediate economic needs.
Your primary economic concerns are making ends meet, healthcare costs, and housing affordability.`
  },
  {
    id: 'middle-class',
    name: 'Middle-Class Professional',
    description: 'Stable career with moderate economic resources',
    systemPrompt: `You are simulating a middle-class professional with stable employment.
Your background includes a college education, moderate savings, and some property ownership.
Your political views are balanced between progressive and conservative elements.
Your primary economic concerns are career advancement, education costs, and retirement security.`
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing Worker',
    description: 'Industrial or factory worker with traditional skills',
    systemPrompt: `You are simulating a manufacturing or industrial worker.
Your background includes long-term employment in traditional industries facing technological disruption.
Your political views tend to favor economic security and protection of traditional industries.
Your primary economic concerns are job security, wage levels, and the future of your industry.`
  },
  {
    id: 'tech-worker',
    name: 'Tech Sector Employee',
    description: 'Worker in growing technology fields',
    systemPrompt: `You are simulating a worker in the technology sector.
Your background includes specialized technical skills, frequent job changes, and comfort with innovation.
Your political views tend to be socially progressive but economically varied.
Your primary economic concerns are industry growth, skills relevance, and work-life balance.`
  }
];

// Simulate policy impacts using Gemini
export async function simulatePolicy(
  policy: Policy,
  group: SocioEconomicGroup
): Promise<SimulationResponse> {
  try {
    if (!genAI) {
      throw new Error('Gemini API not initialized. Call initGemini with your API key first.');
    }

    // Format the policy details for the prompt
    const policyDetails = `
Policy Category: ${policy.category}
Policy Parameters: ${Object.entries(policy.parameters)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}
${policy.customDescription ? `Custom Description: ${policy.customDescription}` : ''}
    `;

    // Create the prompt for Gemini
    const prompt = `
${group.systemPrompt}

Please analyze the following economic policy and provide your reaction to it:

${policyDetails}

Respond with a structured analysis in the following JSON format:
{
  "economicImpact": {
    "personalImpactScore": [number between -5 and 5],
    "communityImpactScore": [number between -5 and 5],
    "rationale": "[explanation]"
  },
  "politicalReaction": {
    "supportLevel": [number between -5 and 5],
    "keyConcerns": ["concern1", "concern2", "concern3"],
    "valuesAlignment": [number between -5 and 5]
  },
  "behavioralResponse": {
    "likelyActions": ["action1", "action2", "action3"],
    "adaptationStrategies": ["strategy1", "strategy2", "strategy3"]
  },
  "narrative": "[a short first-person narrative explaining your perspective]"
}
    `;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from response');
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0]) as SimulationResponse;
      return parsedResponse;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse simulation results');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
} 