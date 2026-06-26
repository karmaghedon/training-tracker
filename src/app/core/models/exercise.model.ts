export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'conditioning' | 'mobility' | 'core';
  primaryMuscleGroup: string;
  secondaryMuscleGroups: string[];
  equipment: string[];
  notes: string;
  injuryTags: string[];
  isActive: boolean;
}


