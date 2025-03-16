import React from 'react';
import { SimulationResponse } from '@/app/lib/gemini';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3,
  User,
  TrendingUp,
  Vote,
  Brain
} from 'lucide-react';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScriptableContext,
  TooltipItem
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SimulationResultsProps {
  results: SimulationResponse | null;
  isLoading: boolean;
  error: string | null;
}

export default function SimulationResults({ results, isLoading, error }: SimulationResultsProps) {
  // Helper function to render scores
  const renderScore = (score: number) => {
    return score > 0 ? `+${score}` : score;
  };

  // Helper function to render progress bars
  const renderProgressBar = (score: number) => {
    // Calculate percentage position (0-100) from score (-5 to +5)
    const percentage = ((score + 5) / 10) * 100;
    const width = Math.min(Math.max(percentage, 0), 100);
    const colorClass = score >= 0 ? 'bg-green-500' : 'bg-red-500';
    
    return (
      <div className="relative w-full h-2 bg-muted rounded-full">
        <div className="absolute left-1/2 w-px h-full bg-foreground/30"></div>
        <div 
          className={`absolute h-full ${colorClass} rounded-full`}
          style={{ 
            width: `${Math.abs(score) * 10}%`, 
            left: score < 0 ? `calc(50% - ${Math.abs(score) * 10}%)` : '50%'
          }}
        ></div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-2/3 bg-muted rounded"></div>
          <div className="h-4 w-3/4 bg-muted rounded"></div>
          <div className="h-4 w-1/3 bg-muted rounded"></div>
        </div>
        <p className="mt-4 text-muted-foreground">Simulating policy impact...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Simulation Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-destructive">{error}</p>
          <p className="text-muted-foreground">Please try again with different parameters or check your API key.</p>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">No Results Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Configure a policy and select a socio-economic group to run a simulation.</p>
        </CardContent>
      </Card>
    );
  }

  // Chart configuration for impact scores with horizontal orientation
  const chartData = {
    labels: ['Personal Impact', 'Community Impact', 'Support Level', 'Values Alignment'],
    datasets: [
      {
        label: 'Impact Score',
        data: [
          results.economicImpact.personalImpactScore,
          results.economicImpact.communityImpactScore,
          results.politicalReaction.supportLevel,
          results.politicalReaction.valuesAlignment
        ],
        backgroundColor: function(context: ScriptableContext<'bar'>) {
          const value = context.raw as number;
          return value >= 0 ? '#22c55e' : '#ef4444';  // Using Tailwind's green-500 and red-500
        },
        borderColor: function(context: ScriptableContext<'bar'>) {
          const value = context.raw as number;
          return value >= 0 ? '#16a34a' : '#dc2626';  // Using Tailwind's green-600 and red-600
        },
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y' as const, // Make the chart horizontal
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: -5,
        max: 5,
        grid: {
          display: false  // Remove vertical grid lines
        },
        border: {
          display: false
        },
        ticks: {
          display: false  // Hide x-axis numbers
        }
      },
      y: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#0f172a',  // slate-900
        bodyColor: '#0f172a',   // slate-900
        borderColor: '#e2e8f0',  // slate-200
        borderWidth: 1,
        padding: 12,
        callbacks: {
          title: () => 'Impact Level',
          label: (tooltipItem: TooltipItem<"bar">) => {
            const value = tooltipItem.raw as number;
            return value > 0 ? `+${value}` : `${value}`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <BarChart3 className="h-5 w-5 shrink-0 text-foreground" />
          <CardTitle className="text-foreground leading-none">Impact Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <User className="h-5 w-5 shrink-0 text-foreground" />
          <CardTitle className="text-foreground leading-none">Personal Perspective</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="italic text-muted-foreground">{results.narrative}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <TrendingUp className="h-5 w-5 shrink-0 text-foreground" />
          <CardTitle className="text-foreground leading-none">Economic Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1 text-foreground">Personal Impact</h4>
            <div className="flex items-center">
              <span className="text-lg font-bold text-foreground mr-4">{renderScore(results.economicImpact.personalImpactScore)}</span>
              {renderProgressBar(results.economicImpact.personalImpactScore)}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1 text-foreground">Community Impact</h4>
            <div className="flex items-center">
              <span className="text-lg font-bold text-foreground mr-4">{renderScore(results.economicImpact.communityImpactScore)}</span>
              {renderProgressBar(results.economicImpact.communityImpactScore)}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">Rationale: </span>
              {results.economicImpact.rationale}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Vote className="h-5 w-5 shrink-0 text-foreground" />
          <CardTitle className="text-foreground leading-none">Political Reaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1 text-foreground">Support Level</h4>
            <div className="flex items-center">
              <span className="text-lg font-bold text-foreground mr-4">{renderScore(results.politicalReaction.supportLevel)}</span>
              {renderProgressBar(results.politicalReaction.supportLevel)}
            </div>
          </div>
          
          <h4 className="text-sm font-medium mb-2 text-foreground">Key Concerns:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {results.politicalReaction.keyConcerns.map((concern, index) => (
              <li key={index} className="text-sm text-muted-foreground">{concern}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Brain className="h-5 w-5 shrink-0 text-foreground" />
          <CardTitle className="text-foreground leading-none">Behavioral Response</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2 text-foreground">Likely Actions:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {results.behavioralResponse.likelyActions.map((action, index) => (
                <li key={index} className="text-sm text-muted-foreground">{action}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2 text-foreground">Adaptation Strategies:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {results.behavioralResponse.adaptationStrategies.map((strategy, index) => (
                <li key={index} className="text-sm text-muted-foreground">{strategy}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 