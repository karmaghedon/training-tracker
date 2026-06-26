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

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutTemplateExercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutTemplateExercise {
  id: string;
  templateId: string;
  exerciseId: string;
  order: number;
  targetSets: number;
  targetReps: number | string; // Can be "max" for max reps
  defaultWeight: number;
  restSeconds: number;
  notes: string;
}
