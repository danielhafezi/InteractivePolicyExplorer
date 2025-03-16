import React, { useState } from 'react';
import { SocioEconomicGroup, socioEconomicGroups } from '@/app/lib/gemini';

interface GroupSelectorProps {
  onGroupSelect: (group: SocioEconomicGroup) => void;
}

export default function GroupSelector({ onGroupSelect }: GroupSelectorProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('low-income');

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    const group = socioEconomicGroups.find(g => g.id === groupId);
    if (group) {
      onGroupSelect(group);
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-lg border border-gray-300">
      <h2 className="text-2xl font-semibold mb-4">Select Socio-Economic Group</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {socioEconomicGroups.map(group => (
          <div
            key={group.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedGroupId === group.id 
                ? 'border-blue-500 bg-blue-50 text-blue-900' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleGroupChange(group.id)}
          >
            <h3 className="font-medium text-lg mb-1">{group.name}</h3>
            <p className="text-sm text-gray-600">{group.description}</p>
          </div>
        ))}
      </div>
      
      {/* Show details of selected group */}
      {selectedGroupId && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-medium mb-2">
            {socioEconomicGroups.find(g => g.id === selectedGroupId)?.name}
          </h3>
          <p className="text-sm whitespace-pre-line">
            {socioEconomicGroups.find(g => g.id === selectedGroupId)?.systemPrompt}
          </p>
        </div>
      )}
    </div>
  );
} 