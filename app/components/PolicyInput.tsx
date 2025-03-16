import React, { useState } from 'react';
import { Policy } from '@/app/lib/gemini';

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
    <div className="bg-white/10 p-6 rounded-lg border border-gray-300">
      <h2 className="text-2xl font-semibold mb-4">Configure Policy</h2>
      
      {/* Policy Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Policy Category</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {policyCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`p-2 rounded-md ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-gray-100'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Parameter Sliders */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Policy Parameters</label>
        {categoryParameters[selectedCategory]?.map(param => (
          <div key={param.name} className="mb-4">
            <div className="flex justify-between">
              <label className="text-sm capitalize">
                {param.name.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <span className="text-sm">{parameters[param.name] || param.defaultValue}</span>
            </div>
            <input
              type="range"
              min={param.min}
              max={param.max}
              step={param.step}
              value={parameters[param.name] || param.defaultValue}
              onChange={(e) => handleParameterChange(param.name, Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        ))}
      </div>
      
      {/* Custom Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Custom Policy Description (Optional)</label>
        <textarea
          value={customDescription}
          onChange={handleDescriptionChange}
          placeholder="Describe your custom policy approach..."
          className="w-full p-2 border rounded-md bg-gray-100 text-gray-800"
          rows={4}
        />
      </div>
    </div>
  );
} 