import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Exercise } from '../models/exercise.model';
import { WorkoutTemplate, WorkoutTemplateExercise } from '../models/workout.model';
import { WorkoutSession, WorkoutSet } from '../models/workout.model';
import { AppSettings } from '../models/settings.model';
import { SEED_EXERCISES, SEED_TEMPLATES, DEFAULT_SETTINGS } from '../constants/seed-data';

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {
  exercises!: Table<Exercise>;
  workoutTemplates!: Table<WorkoutTemplate>;
  workoutTemplateExercises!: Table<WorkoutTemplateExercise>;
  workoutSessions!: Table<WorkoutSession>;
  workoutSets!: Table<WorkoutSet>;
  settings!: Table<AppSettings>;

  constructor() {
    super('TrainingTrackerDB');
    this.version(1).stores({
      exercises: '++id',
      workoutTemplates: '++id',
      workoutTemplateExercises: '++id, templateId',
      workoutSessions: '++id, date',
      workoutSets: '++id, sessionId, exerciseId',
      settings: '++id'
    });
  }

  async initializeDatabase(): Promise<void> {
    try {
      // Check if exercises table is empty
      const exerciseCount = await this.exercises.count();
      if (exerciseCount === 0) {
        // Seed initial data
        await this.exercises.bulkAdd(SEED_EXERCISES);
        await this.workoutTemplates.bulkAdd(SEED_TEMPLATES.templates);
        await this.workoutTemplateExercises.bulkAdd(SEED_TEMPLATES.templateExercises);
        await this.settings.add(DEFAULT_SETTINGS);
        console.log('Database initialized with seed data');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async getSettings(): Promise<AppSettings> {
    const settings = await this.settings.toArray();
    return settings[0] || DEFAULT_SETTINGS;
  }

  async updateSettings(settings: Partial<AppSettings>): Promise<void> {
    const existing = await this.getSettings();
    await this.settings.update(existing.id as any, {
      ...settings,
      updatedAt: new Date()
    });
  }

  async clearAllData(): Promise<void> {
    await this.exercises.clear();
    await this.workoutTemplates.clear();
    await this.workoutTemplateExercises.clear();
    await this.workoutSessions.clear();
    await this.workoutSets.clear();
  }
}
