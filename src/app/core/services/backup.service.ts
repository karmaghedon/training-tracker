import { Injectable } from '@angular/core';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  constructor(private db: DbService) {}

  async exportData(): Promise<string> {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      exercises: await this.db.exercises.toArray(),
      workoutTemplates: await this.db.workoutTemplates.toArray(),
      workoutTemplateExercises: await this.db.workoutTemplateExercises.toArray(),
      workoutSessions: await this.db.workoutSessions.toArray(),
      workoutSets: await this.db.workoutSets.toArray(),
      settings: await this.db.settings.toArray()
    };

    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);

      if (!data.version) {
        throw new Error('Invalid backup file format');
      }

      // Clear existing data
      await this.db.clearAllData();

      // Import data
      if (data.exercises?.length) {
        await this.db.exercises.bulkAdd(data.exercises);
      }
      if (data.workoutTemplates?.length) {
        await this.db.workoutTemplates.bulkAdd(data.workoutTemplates);
      }
      if (data.workoutTemplateExercises?.length) {
        await this.db.workoutTemplateExercises.bulkAdd(data.workoutTemplateExercises);
      }
      if (data.workoutSessions?.length) {
        await this.db.workoutSessions.bulkAdd(data.workoutSessions);
      }
      if (data.workoutSets?.length) {
        await this.db.workoutSets.bulkAdd(data.workoutSets);
      }
      if (data.settings?.length) {
        await this.db.settings.bulkAdd(data.settings);
      }

      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  downloadBackup(): void {
    this.exportData().then(jsonString => {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `training-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
