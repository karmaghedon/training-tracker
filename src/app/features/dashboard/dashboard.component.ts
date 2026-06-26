import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DbService } from '../../core/services/db.service';
import { WorkoutSession } from '../../core/models/workout.model';
import { ProgressionService } from '../../core/services/progression.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <section class="dashboard-section">
        <h2>Welcome Back!</h2>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-label">Last Workout</div>
            <div class="stat-value" *ngIf="lastWorkout">
              {{ lastWorkout.date | date: 'short' }}
            </div>
            <div class="stat-value" *ngIf="!lastWorkout">
              No workouts yet
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-label">Workouts This Week</div>
            <div class="stat-value">{{ weeklyWorkoutCount }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-label">Total Workouts</div>
            <div class="stat-value">{{ totalWorkouts }}</div>
          </mat-card-content>
        </mat-card>
      </section>

      <section class="dashboard-section action-buttons">
        <button mat-raised-button color="accent" routerLink="/workout" class="large-button">
          <mat-icon>play_circle_filled</mat-icon>
          Start Workout
        </button>
        <button mat-raised-button routerLink="/history" class="large-button">
          <mat-icon>history</mat-icon>
          Workout History
        </button>
        <button mat-raised-button routerLink="/exercises" class="large-button">
          <mat-icon>fitness_center</mat-icon>
          Exercise Library
        </button>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .dashboard-section {
      margin-bottom: 24px;
    }

    h2 {
      margin-top: 0;
      font-size: 1.5rem;
    }

    .stat-card {
      margin-bottom: 12px;
      text-align: center;
    }

    .stat-label {
      font-size: 0.875rem;
      color: rgba(0,0,0,0.6);
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 600;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .large-button {
      height: 56px;
      font-size: 1.1rem;
      width: 100%;
    }
  `]
})
export class DashboardComponent implements OnInit {
  lastWorkout: WorkoutSession | null = null;
  weeklyWorkoutCount = 0;
  totalWorkouts = 0;

  constructor(
    private db: DbService,
    private progression: ProgressionService
  ) {}

  async ngOnInit() {
    await this.loadStats();
  }

  async loadStats() {
    const workouts = await this.db.workoutSessions.toArray();
    this.totalWorkouts = workouts.length;

    if (workouts.length > 0) {
      this.lastWorkout = workouts[workouts.length - 1];
    }

    // Count workouts from past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    this.weeklyWorkoutCount = workouts.filter(
      w => new Date(w.date) >= sevenDaysAgo
    ).length;
  }
}
