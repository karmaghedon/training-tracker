import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DbService } from '../../core/services/db.service';
import { WorkoutSession } from '../../core/models/workout.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="history-container">
      <h2>Workout History</h2>

      <div class="workouts-list">
        <mat-card *ngFor="let workout of workouts; let i = index" class="workout-card">
          <mat-card-header>
            <mat-card-title>{{ workout.workoutName }}</mat-card-title>
            <mat-card-subtitle>{{ workout.date | date: 'medium' }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="workout-detail">
              <span class="label">Duration:</span>
              <span class="value">{{ workout.durationMinutes }} min</span>
            </div>
            <div class="workout-detail">
              <span class="label">Status:</span>
              <span class="value" [class.completed]="workout.completed">
                {{ workout.completed ? 'Completed ✓' : 'In Progress' }}
              </span>
            </div>
          </mat-card-content>
          <mat-card-actions>
             <button mat-button (click)="deleteWorkout(workout.id)">
              <mat-icon>delete</mat-icon>
                Delete
             </button>
          </mat-card-actions>
      </div>

      <div *ngIf="workouts.length === 0" class="no-data">
        No workouts recorded yet. Start your first workout!
      </div>
    </div>
  `,
  styles: [`
    .history-container {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .workouts-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .workout-card {
      margin-bottom: 8px;
    }

    .workout-detail {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }

    .workout-detail:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
    }

    .value {
      font-weight: bold;
      color: #1976d2;
    }

    .value.completed {
      color: #4caf50;
    }

    .no-data {
      text-align: center;
      padding: 40px 16px;
      color: rgba(0,0,0,0.6);
    }

    mat-card-actions {
      padding: 12px;
    }
  `]
})
export class HistoryComponent implements OnInit {
  workouts: WorkoutSession[] = [];

  constructor(private db: DbService) {}

  async ngOnInit() {
    await this.loadWorkouts();
  }

  async loadWorkouts() {
    this.workouts = await this.db.workoutSessions
      .orderBy('date')
      .reverse()
      .toArray();
  }

  async deleteWorkout(id: any) {
    if (confirm('Are you sure you want to delete this workout?')) {
      await this.db.workoutSessions.delete(id);
      await this.loadWorkouts();
    }
  }
}
