'use client';

import { useState } from 'react';
import PolicyInput from './components/PolicyInput';
import GroupSelector from './components/GroupSelector';
import SimulationResults from './components/SimulationResults';
import { Policy, SocioEconomicGroup, SimulationResponse, socioEconomicGroups } from './lib/gemini';

export default function Home() {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<SocioEconomicGroup>(socioEconomicGroups[0]);
  const [apiKey, setApiKey] = useState<string>('');
  const [results, setResults] = useState<SimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePolicyChange = (newPolicy: Policy) => {
    setPolicy(newPolicy);
  };

  const handleGroupSelect = (group: SocioEconomicGroup) => {
    setSelectedGroup(group);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const runSimulation = async () => {
    if (!policy) {
      setError('Please configure a policy first');
      return;
    }

    if (!apiKey) {
      setError('Please enter your Gemini API key');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          policy,
          group: selectedGroup,
          apiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to simulate policy');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Interactive Policy Explorer
          </h1>
          <p className="text-xl text-blue-700">
            A Gemini-Powered Economic Policy Simulation Tool
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <PolicyInput onPolicyChange={handlePolicyChange} />
            
            <div className="mt-6">
              <GroupSelector onGroupSelect={handleGroupSelect} />
            </div>
            
            <div className="mt-6 bg-white/10 p-6 rounded-lg border border-gray-300">
              <h2 className="text-2xl font-semibold mb-4">API Configuration</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your Gemini API key"
                  className="w-full p-2 border rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your API key from Google AI Studio
                </p>
              </div>
              
              <button
                onClick={runSimulation}
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed text-gray-100'
                    : 'bg-blue-600 hover:bg-blue-700 text-gray-100'
                }`}
              >
                {isLoading ? 'Simulating...' : 'Run Simulation'}
              </button>
            </div>
          </div>
          
          <div>
            <SimulationResults
              results={results}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 