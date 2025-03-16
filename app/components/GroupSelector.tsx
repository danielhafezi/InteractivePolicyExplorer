import React, { useState, useEffect } from 'react';
import { SocioEconomicGroup, socioEconomicGroups } from '@/app/lib/gemini';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface GroupSelectorProps {
  onGroupSelect: (group: SocioEconomicGroup) => void;
}

export default function GroupSelector({ onGroupSelect }: GroupSelectorProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('low-income');
  const [groups, setGroups] = useState<SocioEconomicGroup[]>(socioEconomicGroups);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedPrompt, setEditedPrompt] = useState<string>('');

  // Update selected group when it changes
  useEffect(() => {
    const group = groups.find(g => g.id === selectedGroupId);
    if (group) {
      onGroupSelect(group);
    }
  }, [groups, selectedGroupId, onGroupSelect]);

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    const group = groups.find(g => g.id === groupId);
    if (group) {
      onGroupSelect(group);
    }
  };

  const startEditingName = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setEditingName(groupId);
      setEditedName(group.name);
    }
  };

  const startEditingPrompt = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setEditingPrompt(groupId);
      setEditedPrompt(group.systemPrompt);
    }
  };

  const saveNameEdit = (groupId: string) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { ...group, name: editedName } 
          : group
      )
    );
    setEditingName(null);
  };

  const savePromptEdit = (groupId: string) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { ...group, systemPrompt: editedPrompt } 
          : group
      )
    );
    setEditingPrompt(null);
  };

  const cancelEdit = () => {
    setEditingName(null);
    setEditingPrompt(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map(group => (
          <Card 
            key={group.id}
            className={`cursor-pointer transition-colors hover:bg-accent ${
              selectedGroupId === group.id 
                ? 'border-primary' 
                : 'border-border'
            }`}
            onClick={() => handleGroupChange(group.id)}
          >
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-1 text-foreground">{group.name}</h3>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Show details of selected group */}
      {selectedGroupId && (
        <Card className="mt-4 bg-accent/50">
          <CardContent className="p-4">
            {editingName === selectedGroupId ? (
              <div className="mb-4">
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="mb-2"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <Button size="sm" variant="default" onClick={() => saveNameEdit(selectedGroupId)}>Save</Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                </div>
              </div>
            ) : (
              <h3 
                className="font-medium mb-2 text-foreground cursor-pointer hover:text-primary"
                onClick={() => startEditingName(selectedGroupId)}
                title="Click to edit title"
              >
                {groups.find(g => g.id === selectedGroupId)?.name}
              </h3>
            )}
            
            {editingPrompt === selectedGroupId ? (
              <div>
                <Textarea
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  className="min-h-[200px] mb-2"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <Button size="sm" variant="default" onClick={() => savePromptEdit(selectedGroupId)}>Save</Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                </div>
              </div>
            ) : (
              <p 
                className="text-sm whitespace-pre-line text-muted-foreground cursor-pointer hover:text-primary"
                onClick={() => startEditingPrompt(selectedGroupId)}
                title="Click to edit prompt"
              >
                {groups.find(g => g.id === selectedGroupId)?.systemPrompt}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 