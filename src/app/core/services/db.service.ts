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
import {
  SEED_EXERCISES,
  SEED_TEMPLATES,
  DEFAULT_SETTINGS
} from '../constants/seed-data';

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

  async initializeDatabase(): Promise<void> {
    const exerciseCount = await this.exercises.count();

    if (exerciseCount === 0) {
      await this.exercises.bulkAdd(SEED_EXERCISES);
    }

    const templateCount = await this.workoutTemplates.count();

    if (templateCount === 0) {
      await this.workoutTemplates.bulkAdd(SEED_TEMPLATES.templates);
    }

    const templateExerciseCount = await this.workoutTemplateExercises.count();

    if (templateExerciseCount === 0) {
      await this.workoutTemplateExercises.bulkAdd(SEED_TEMPLATES.templateExercises);
    }

    const settingsCount = await this.settings.count();

    if (settingsCount === 0) {
      await this.settings.add(DEFAULT_SETTINGS);
    }
  }

  async getSettings(): Promise<AppSettings> {
    const existingSettings = await this.settings.toArray();

    if (existingSettings.length > 0) {
      return existingSettings[0];
    }

    await this.settings.add(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  async updateSettings(settings: AppSettings): Promise<void> {
    settings.updatedAt = new Date();
    await this.settings.put(settings);
  }

  async clearAllData(): Promise<void> {
  await this.exercises.clear();
  await this.workoutTemplates.clear();
  await this.workoutTemplateExercises.clear();
  await this.workoutSessions.clear();
  await this.workoutSets.clear();
  await this.settings.clear();
}
  
}
