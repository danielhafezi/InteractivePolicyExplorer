import React, { useState } from 'react';
import { Policy } from '@/app/lib/gemini';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

// Define available policy categories
const policyCategories = [
  { id: 'green', name: 'Green Transition Policies' },
  { id: 'ai', name: 'AI/Automation Policies' },
  { id: 'combined', name: 'Combined Approaches' }
];

// Define parameter configurations for each category
const categoryParameters: Record<string, {name: string, min: number, max: number, step: number, defaultValue: number}[]> = {
  green: [
    { name: 'carbonTaxLevel', min: 0, max: 10, step: 1, defaultValue: 5 },
    { name: 'renewableSubsidies', min: 0, max: 10, step: 1, defaultValue: 5 },
    { name: 'implementationSpeed', min: 1, max: 10, step: 1, defaultValue: 5 }
  ],
  ai: [
    { name: 'ubiAmount', min: 0, max: 10, step: 1, defaultValue: 5 },
    { name: 'retrainingFunding', min: 0, max: 10, step: 1, defaultValue: 5 },
    { name: 'automationTax', min: 0, max: 10, step: 1, defaultValue: 3 }
  ],
  combined: [
    { name: 'greenJobsInvestment', min: 0, max: 10, step: 1, defaultValue: 5 },
    { name: 'aiGovernanceLevel', min: 0, max: 10, step: 1, defaultValue: 5 },
    { name: 'socialSafetyNetStrength', min: 0, max: 10, step: 1, defaultValue: 5 }
  ]
};

interface PolicyInputProps {
  onPolicyChange: (policy: Policy) => void;
}

export default function PolicyInput({ onPolicyChange }: PolicyInputProps) {
  const [selectedCategory, setSelectedCategory] = useState('green');
  const [parameters, setParameters] = useState<Record<string, number>>({});
  const [customDescription, setCustomDescription] = useState('');

  // Initialize parameters for selected category
  React.useEffect(() => {
    const initialParameters: Record<string, number> = {};
    categoryParameters[selectedCategory].forEach(param => {
      initialParameters[param.name] = param.defaultValue;
    });
    setParameters(initialParameters);
  }, [selectedCategory]);

  // Handle parameter change
  const handleParameterChange = (name: string, value: number) => {
    setParameters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update policy
    updatePolicy();
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Handle custom description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomDescription(e.target.value);
    updatePolicy();
  };

  // Update policy when parameters change
  const updatePolicy = () => {
    const policy: Policy = {
      category: policyCategories.find(c => c.id === selectedCategory)?.name || '',
      parameters,
      customDescription: customDescription || undefined
    };

    onPolicyChange(policy);
  };

  return (
    <div className="space-y-6">
      {/* Policy Category Selection */}
      <Tabs defaultValue={selectedCategory} onValueChange={handleCategoryChange}>
        <TabsList className="grid w-full grid-cols-3">
          {policyCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-foreground">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {policyCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
            {categoryParameters[category.id]?.map(param => (
              <div key={param.name} className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm capitalize text-foreground">
                    {param.name.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <span className="text-sm font-medium text-foreground">
                    {parameters[param.name] || param.defaultValue}
                  </span>
                </div>
                <Slider
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={[parameters[param.name] || param.defaultValue]}
                  onValueChange={(values) => handleParameterChange(param.name, values[0])}
                />
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Custom Description */}
      <div className="space-y-2">
        <Label className="text-foreground">Custom Policy Description (Optional)</Label>
        <Textarea
          value={customDescription}
          onChange={handleDescriptionChange}
          placeholder="Describe your custom policy approach..."
          className="resize-none text-foreground"
          rows={4}
        />
      </div>
    </div>
  );
} 