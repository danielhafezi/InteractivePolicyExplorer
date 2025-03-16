'use client';

import { useState } from 'react';
import PolicyInput from './components/PolicyInput';
import GroupSelector from './components/GroupSelector';
import SimulationResults from './components/SimulationResults';
import { Policy, SocioEconomicGroup, SimulationResponse, socioEconomicGroups } from './lib/gemini';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl text-foreground">Interactive Policy Explorer</CardTitle>
          <CardDescription className="text-xl text-muted-foreground">A Gemini-Powered Economic Policy Simulation Tool</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Configure Policy</CardTitle>
              <CardDescription>Set parameters for your economic policy</CardDescription>
            </CardHeader>
            <CardContent>
              <PolicyInput onPolicyChange={handlePolicyChange} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Select Target Group</CardTitle>
              <CardDescription>Choose which socio-economic group to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <GroupSelector onGroupSelect={handleGroupSelect} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">API Configuration</CardTitle>
              <CardDescription>Connect to Gemini API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Gemini API Key
                </label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your Gemini API key"
                  className="text-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Get your API key from Google AI Studio
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={runSimulation}
                disabled={isLoading}
                variant="default"
              >
                {isLoading ? 'Simulating...' : 'Run Simulation'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-foreground">Simulation Results</CardTitle>
              <CardDescription>Analysis of policy impact</CardDescription>
            </CardHeader>
            <CardContent>
              <SimulationResults
                results={results}
                isLoading={isLoading}
                error={error}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 