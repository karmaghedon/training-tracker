export interface WorkoutSession {
  id: string;
  templateId: string;
  workoutName: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  durationMinutes?: number;
  notes: string;
  completed: boolean;
}

export interface WorkoutSet {
  id: string;
  sessionId: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weight: number;
  unit: 'lb' | 'kg';
  rpe: number; // Rate of Perceived Exertion 1-10
  painLevel: number; // 0-10
  completed: boolean;
  notes: string;
  timestamp: Date;
}
