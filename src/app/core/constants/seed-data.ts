import { Exercise } from '../models/exercise.model';
import { WorkoutTemplate, WorkoutTemplateExercise } from '../models/workout.model';
import { AppSettings } from '../models/settings.model';

// Simple UUID generator
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const SEED_EXERCISES: Exercise[] = [
  {
    id: generateId(),
    name: 'Bench Press',
    category: 'strength',
    primaryMuscleGroup: 'Chest',
    secondaryMuscleGroups: ['Triceps', 'Shoulders'],
    equipment: ['Barbell'],
    notes: 'Compound pressing movement',
    injuryTags: [],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Front Squat',
    category: 'strength',
    primaryMuscleGroup: 'Quads',
    secondaryMuscleGroups: ['Back', 'Core'],
    equipment: ['Barbell'],
    notes: 'Keep chest upright',
    injuryTags: ['knee-friendly'],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Romanian Deadlift',
    category: 'strength',
    primaryMuscleGroup: 'Hamstrings',
    secondaryMuscleGroups: ['Back', 'Glutes'],
    equipment: ['Barbell', 'Dumbbell'],
    notes: 'Hip hinge movement',
    injuryTags: ['caution-lower-back'],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Incline Dumbbell Row',
    category: 'strength',
    primaryMuscleGroup: 'Back',
    secondaryMuscleGroups: ['Biceps'],
    equipment: ['Dumbbell'],
    notes: 'Set bench to 45 degrees',
    injuryTags: ['back-friendly'],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Pull-up',
    category: 'strength',
    primaryMuscleGroup: 'Back',
    secondaryMuscleGroups: ['Biceps'],
    equipment: ['Pull-up Bar'],
    notes: 'Compound pulling movement',
    injuryTags: [],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Chin-up',
    category: 'strength',
    primaryMuscleGroup: 'Back',
    secondaryMuscleGroups: ['Biceps'],
    equipment: ['Pull-up Bar'],
    notes: 'Palms facing you',
    injuryTags: [],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Inverted Row',
    category: 'strength',
    primaryMuscleGroup: 'Back',
    secondaryMuscleGroups: ['Biceps', 'Core'],
    equipment: ['Barbell', 'TRX'],
    notes: 'Great bodyweight alternative',
    injuryTags: ['back-friendly'],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Chest Dip',
    category: 'strength',
    primaryMuscleGroup: 'Chest',
    secondaryMuscleGroups: ['Triceps', 'Shoulders'],
    equipment: ['Dip Bar'],
    notes: 'Lean forward for chest emphasis',
    injuryTags: ['caution-elbow'],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Dumbbell Military Press',
    category: 'strength',
    primaryMuscleGroup: 'Shoulders',
    secondaryMuscleGroups: ['Triceps', 'Chest'],
    equipment: ['Dumbbell'],
    notes: 'Keep core tight',
    injuryTags: [],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Face Pull',
    category: 'strength',
    primaryMuscleGroup: 'Shoulders',
    secondaryMuscleGroups: ['Back'],
    equipment: ['Cable', 'Resistance Band'],
    notes: 'Great for shoulder health',
    injuryTags: ['back-friendly'],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Glute Bridge',
    category: 'strength',
    primaryMuscleGroup: 'Glutes',
    secondaryMuscleGroups: ['Hamstrings', 'Core'],
    equipment: ['Bodyweight'],
    notes: 'Squeeze glutes at top',
    injuryTags: ['knee-friendly'],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Goblet Squat',
    category: 'strength',
    primaryMuscleGroup: 'Quads',
    secondaryMuscleGroups: ['Glutes', 'Core'],
    equipment: ['Dumbbell', 'Kettlebell'],
    notes: 'Great for beginners',
    injuryTags: ['knee-friendly'],
    isActive: true
  },
  {
    id: generateId(),
    name: 'EZ Bar Skullcrusher',
    category: 'strength',
    primaryMuscleGroup: 'Triceps',
    secondaryMuscleGroups: [],
    equipment: ['EZ Bar'],
    notes: 'Lower behind head',
    injuryTags: ['caution-elbow'],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Triceps Extension',
    category: 'strength',
    primaryMuscleGroup: 'Triceps',
    secondaryMuscleGroups: [],
    equipment: ['Dumbbell', 'Cable'],
    notes: 'Full range of motion',
    injuryTags: ['caution-elbow'],
    isActive: true
  },
  {
    id: generateId(),
    name: 'Incline Dumbbell Press',
    category: 'strength',
    primaryMuscleGroup: 'Chest',
    secondaryMuscleGroups: ['Shoulders', 'Triceps'],
    equipment: ['Dumbbell'],
    notes: 'Set bench to 30-45 degrees',
    injuryTags: [],
    isActive: true
  }
];

// Create template exercises for each template
function createTemplateExercises(): {
  templates: WorkoutTemplate[];
  templateExercises: WorkoutTemplateExercise[];
} {
  const templateExercisesArray: WorkoutTemplateExercise[] = [];

  // Find exercise IDs
  const exerciseMap = new Map(SEED_EXERCISES.map(e => [e.name, e.id]));

  // Workout A
  const templateAId = generateId();
  const templateA: WorkoutTemplate = {
    id: templateAId,
    name: 'Workout A',
    description: 'Lower body focus with upper body volume',
    exercises: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const exercisesA = [
    { name: 'Goblet Squat', sets: 3, reps: 10, weight: 35, rest: 90 },
    { name: 'Glute Bridge', sets: 3, reps: 10, weight: 185, rest: 60 },
    { name: 'Bench Press', sets: 3, reps: 10, weight: 185, rest: 180 },
    { name: 'Incline Dumbbell Row', sets: 3, reps: 10, weight: 70, rest: 90 },
    { name: 'Chin-up', sets: 3, reps: 'max', weight: 0, rest: 180 },
    { name: 'Chest Dip', sets: 3, reps: 10, weight: 0, rest: 120 },
    { name: 'Face Pull', sets: 2, reps: 15, weight: 30, rest: 60 }
  ];

  exercisesA.forEach((ex, idx) => {
    templateExercisesArray.push({
      id: generateId(),
      templateId: templateAId,
      exerciseId: exerciseMap.get(ex.name) || '',
      order: idx,
      targetSets: ex.sets,
      targetReps: ex.reps,
      defaultWeight: ex.weight,
      restSeconds: ex.rest,
      notes: ''
    });
  });

  // Workout B
  const templateBId = generateId();
  const templateB: WorkoutTemplate = {
    id: templateBId,
    name: 'Workout B',
    description: 'Upper body focus with lower body volume',
    exercises: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const exercisesB = [
    { name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 275, rest: 180 },
    { name: 'Front Squat', sets: 3, reps: 10, weight: 185, rest: 180 },
    { name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 65, rest: 90 },
    { name: 'Pull-up', sets: 3, reps: 'max', weight: 0, rest: 180 },
    { name: 'Inverted Row', sets: 3, reps: 10, weight: 0, rest: 90 },
    { name: 'Dumbbell Military Press', sets: 3, reps: 10, weight: 50, rest: 90 },
    { name: 'Triceps Extension', sets: 2, reps: 10, weight: 40, rest: 60 }
  ];

  exercisesB.forEach((ex, idx) => {
    templateExercisesArray.push({
      id: generateId(),
      templateId: templateBId,
      exerciseId: exerciseMap.get(ex.name) || '',
      order: idx,
      targetSets: ex.sets,
      targetReps: ex.reps,
      defaultWeight: ex.weight,
      restSeconds: ex.rest,
      notes: ''
    });
  });

  // Workout C
  const templateCId = generateId();
  const templateC: WorkoutTemplate = {
    id: templateCId,
    name: 'Workout C',
    description: 'Full body strength focus',
    exercises: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const exercisesC = [
    { name: 'Front Squat', sets: 3, reps: 8, weight: 185, rest: 180 },
    { name: 'Bench Press', sets: 3, reps: 8, weight: 205, rest: 180 },
    { name: 'Romanian Deadlift', sets: 3, reps: 8, weight: 295, rest: 180 },
    { name: 'Inverted Row', sets: 3, reps: 10, weight: 0, rest: 90 },
    { name: 'Dumbbell Military Press', sets: 3, reps: 10, weight: 55, rest: 90 },
    { name: 'Face Pull', sets: 2, reps: 15, weight: 30, rest: 60 }
  ];

  exercisesC.forEach((ex, idx) => {
    templateExercisesArray.push({
      id: generateId(),
      templateId: templateCId,
      exerciseId: exerciseMap.get(ex.name) || '',
      order: idx,
      targetSets: ex.sets,
      targetReps: ex.reps,
      defaultWeight: ex.weight,
      restSeconds: ex.rest,
      notes: ''
    });
  });

  return {
    templates: [templateA, templateB, templateC],
    templateExercises: templateExercisesArray
  };
}

export const SEED_TEMPLATES = createTemplateExercises();

export const DEFAULT_SETTINGS: AppSettings = {
  id: generateId(),
  weightUnit: 'lb',
  theme: 'dark',
  defaultRestSeconds: 90,
  createdAt: new Date(),
  updatedAt: new Date()
};
