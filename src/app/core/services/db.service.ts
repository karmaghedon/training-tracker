import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';

import { Exercise } from '../models/exercise.model';
import {
  WorkoutSession,
  WorkoutSet,
  WorkoutTemplate,
  WorkoutTemplateExercise
} from '../models/workout.model';
import { AppSettings } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {
  exercises!: Table<Exercise, string>;
  workoutTemplates!: Table<WorkoutTemplate, string>;
  workoutTemplateExercises!: Table<WorkoutTemplateExercise, string>;
  workoutSessions!: Table<WorkoutSession, string>;
  workoutSets!: Table<WorkoutSet, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('TrainingTrackerDB');

    this.version(1).stores({
      exercises: 'id, name, primaryMuscleGroup, isActive',
      workoutTemplates: 'id, name, updatedAt',
      workoutTemplateExercises: 'id, templateId, exerciseId, order',
      workoutSessions: 'id, templateId, date, completed',
      workoutSets: 'id, sessionId, exerciseId, timestamp, completed',
      settings: 'id'
    });
  }
}
