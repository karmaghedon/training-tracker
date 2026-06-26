import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { WorkoutSet } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class ProgressionService {
  constructor(private db: DbService) {}

  /**
   * Calculate estimated 1RM using Epley formula
   * estimated1RM = weight * (1 + reps / 30)
   */
  calculateEstimated1RM(weight: number, reps: number): number {
    if (reps === 0) return weight;
    return Math.round(weight * (1 + reps / 30) * 100) / 100;
  }

  /**
   * Get exercise history
   */
  async getExerciseHistory(exerciseId: string, limit: number = 50): Promise<WorkoutSet[]> {
    return this.db.workoutSets
      .where('exerciseId')
      .equals(exerciseId)
      .reverse()
      .limit(limit)
      .toArray();
  }

  /**
   * Get best weight for an exercise
   */
  async getBestWeight(exerciseId: string): Promise<number> {
    const sets = await this.getExerciseHistory(exerciseId);
    if (sets.length === 0) return 0;
    return Math.max(...sets.map(s => s.weight));
  }

  /**
   * Get total volume (weight x reps) for an exercise
   */
  async getTotalVolume(exerciseId: string, days: number = 7): Promise<number> {
    const sets = await this.getExerciseHistory(exerciseId, 1000);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return sets
      .filter(s => new Date(s.timestamp) >= cutoffDate && s.completed)
      .reduce((total, set) => total + (set.weight * set.reps), 0);
  }

  /**
   * Get best estimated 1RM for an exercise
   */
  async getBestEstimated1RM(exerciseId: string): Promise<number> {
    const sets = await this.getExerciseHistory(exerciseId);
    if (sets.length === 0) return 0;

    return Math.max(
      ...sets
        .filter(s => s.completed)
        .map(s => this.calculateEstimated1RM(s.weight, s.reps))
    );
  }

  /**
   * Get progression recommendation
   */
  async getProgressionRecommendation(
    exerciseId: string,
    targetSets: number,
    targetReps: number
  ): Promise<string> {
    const history = await this.getExerciseHistory(exerciseId, 10);
    if (history.length === 0) return 'Start with light weight to learn form.';

    const recentSets = history.slice(0, targetSets);
    const completedAll = recentSets.every(s => s.completed && s.reps >= targetReps);

    if (completedAll) {
      return '✓ All sets completed! Consider increasing weight by 5-10%.';
    }

    const recentPainLevel = Math.max(...recentSets.map(s => s.painLevel));
    if (recentPainLevel >= 7) {
      return '⚠ High pain detected. Consider reducing weight or replacing exercise.';
    }

    if (recentPainLevel >= 4) {
      return '⚠ Mild pain detected. Monitor closely.';
    }

    return 'Maintain current weight or increase slightly.';
  }
}
