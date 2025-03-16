import React from 'react';
import { SimulationResponse } from '@/app/lib/gemini';

interface SimulationResultsProps {
  results: SimulationResponse | null;
  isLoading: boolean;
  error: string | null;
}

export default function SimulationResults({
  results,
  isLoading,
  error
}: SimulationResultsProps) {
  if (isLoading) {
    return (
      <div className="bg-white/10 p-6 rounded-lg border border-gray-300 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-3/4 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-1/2 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
        </div>
        <p className="mt-4 text-gray-600">Simulating policy impact...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 p-6 rounded-lg border border-red-300">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Simulation Error</h2>
        <p className="text-red-500">{error}</p>
        <p className="mt-4 text-gray-600">Please try again with different parameters or check your API key.</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white/10 p-6 rounded-lg border border-gray-300">
        <h2 className="text-2xl font-semibold mb-4">Simulation Results</h2>
        <p className="text-gray-600">Configure a policy and select a socio-economic group to run a simulation.</p>
      </div>
    );
  }

  // Helper function to render score with color coding
  const renderScore = (score: number) => {
    let colorClass = 'text-gray-800';
    if (score > 2) colorClass = 'text-green-600';
    else if (score > 0) colorClass = 'text-green-500';
    else if (score < -2) colorClass = 'text-red-600';
    else if (score < 0) colorClass = 'text-red-500';

    return (
      <span className={`font-bold ${colorClass}`}>
        {score > 0 ? `+${score}` : score}
      </span>
    );
  };

  return (
    <div className="bg-white/10 p-6 rounded-lg border border-gray-300">
      <h2 className="text-2xl font-semibold mb-4">Simulation Results</h2>

      {/* Narrative Section */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-medium mb-2">Personal Perspective</h3>
        <p className="italic text-gray-700">{results.narrative}</p>
      </div>

      {/* Economic Impact */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Economic Impact</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Personal Impact</div>
            <div className="text-2xl mt-1">
              {renderScore(results.economicImpact.personalImpactScore)}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500">Community Impact</div>
            <div className="text-2xl mt-1">
              {renderScore(results.economicImpact.communityImpactScore)}
            </div>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <strong>Rationale:</strong> {results.economicImpact.rationale}
        </div>
      </div>

      {/* Political Reaction */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Political Reaction</h3>
        <div className="p-3 bg-gray-50 rounded mb-2">
          <div className="text-sm text-gray-500">Support Level</div>
          <div className="text-2xl mt-1">
            {renderScore(results.politicalReaction.supportLevel)}
          </div>
        </div>
        
        <div className="mt-2">
          <strong className="text-sm">Key Concerns:</strong>
          <ul className="list-disc list-inside mt-1">
            {results.politicalReaction.keyConcerns.map((concern, index) => (
              <li key={index} className="text-sm">{concern}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Behavioral Response */}
      <div>
        <h3 className="font-medium mb-2">Behavioral Response</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong className="text-sm">Likely Actions:</strong>
            <ul className="list-disc list-inside mt-1">
              {results.behavioralResponse.likelyActions.map((action, index) => (
                <li key={index} className="text-sm">{action}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="text-sm">Adaptation Strategies:</strong>
            <ul className="list-disc list-inside mt-1">
              {results.behavioralResponse.adaptationStrategies.map((strategy, index) => (
                <li key={index} className="text-sm">{strategy}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 