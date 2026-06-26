import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { DbService } from '../../core/services/db.service';
import { ProgressionService } from '../../core/services/progression.service';
import { Exercise } from '../../core/models/exercise.model';
import { WorkoutSet } from '../../core/models/workout.model';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule
  ],
  template: `
    <div class="progress-container">
      <h2>Progress</h2>

      <mat-form-field appearance="outline">
        <mat-label>Select Exercise</mat-label>
        <mat-select [(ngModel)]="selectedExerciseId" (selectionChange)="loadProgress()">
          <mat-option *ngFor="let exercise of exercises" [value]="exercise.id">
            {{ exercise.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <div *ngIf="selectedExercise">
        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>{{ selectedExercise.name }}</mat-card-title>
            <mat-card-subtitle>{{ selectedExercise.primaryMuscleGroup }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-label">Best Weight</div>
                <div class="stat-value">{{ bestWeight }} lb</div>
              </div>

              <div class="stat-box">
                <div class="stat-label">Best Est. 1RM</div>
                <div class="stat-value">{{ bestEstimated1RM }} lb</div>
              </div>

              <div class="stat-box">
                <div class="stat-label">7-Day Volume</div>
                <div class="stat-value">{{ totalVolume }} lb</div>
              </div>

              <div class="stat-box">
                <div class="stat-label">Completed Sets</div>
                <div class="stat-value">{{ completedSetsCount }}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="recommendation-card">
          <mat-card-content>
            <strong>Recommendation</strong>
            <p>{{ recommendation }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="history-card">
          <mat-card-header>
            <mat-card-title>Recent Sets</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <table mat-table [dataSource]="history" class="history-table">

              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let set">
                  {{ set.timestamp | date: 'MMM d' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="set">
                <th mat-header-cell *matHeaderCellDef>Set</th>
                <td mat-cell *matCellDef="let set">
                  {{ set.setNumber }}
                </td>
              </ng-container>

              <ng-container matColumnDef="weight">
                <th mat-header-cell *matHeaderCellDef>Weight</th>
                <td mat-cell *matCellDef="let set">
                  {{ set.weight }} {{ set.unit }}
                </td>
              </ng-container>

              <ng-container matColumnDef="reps">
                <th mat-header-cell *matHeaderCellDef>Reps</th>
                <td mat-cell *matCellDef="let set">
                  {{ set.reps }}
                </td>
              </ng-container>

              <ng-container matColumnDef="rpe">
                <th mat-header-cell *matHeaderCellDef>RPE</th>
                <td mat-cell *matCellDef="let set">
                  {{ set.rpe || '-' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="pain">
                <th mat-header-cell *matHeaderCellDef>Pain</th>
                <td mat-cell *matCellDef="let set">
                  {{ set.painLevel }}
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="history.length === 0" class="no-data">
              No completed sets yet for this exercise.
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="!selectedExercise && exercises.length === 0" class="no-data">
        No exercises found.
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      padding: 16px;
      max-width: 700px;
      margin: 0 auto;
    }

    h2 {
      margin-top: 0;
      font-size: 1.5rem;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .summary-card,
    .recommendation-card,
    .history-card {
      margin-bottom: 16px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    }

    .stat-box {
      background: rgba(0, 0, 0, 0.04);
      border-radius: 12px;
      padding: 14px;
      text-align: center;
    }

    .stat-label {
      font-size: 0.8rem;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 6px;
    }

    .stat-value {
      font-size: 1.3rem;
      font-weight: 700;
    }

    .history-table {
      width: 100%;
      font-size: 0.85rem;
    }

    .no-data {
      text-align: center;
      padding: 32px 16px;
      color: rgba(0, 0, 0, 0.6);
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .history-table {
        font-size: 0.75rem;
      }
    }
  `]
})
export class ProgressComponent implements OnInit {
  exercises: Exercise[] = [];
  selectedExerciseId = '';
  selectedExercise: Exercise | null = null;

  history: WorkoutSet[] = [];

  bestWeight = 0;
  bestEstimated1RM = 0;
  totalVolume = 0;
  completedSetsCount = 0;
  recommendation = '';

  displayedColumns = ['date', 'set', 'weight', 'reps', 'rpe', 'pain'];

  constructor(
    private db: DbService,
    private progression: ProgressionService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadExercises();

    if (this.exercises.length > 0) {
      this.selectedExerciseId = this.exercises[0].id;
      await this.loadProgress();
    }
  }

  async loadExercises(): Promise<void> {
    const allExercises = await this.db.exercises.toArray();

    this.exercises = allExercises
      .filter(exercise => exercise.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async loadProgress(): Promise<void> {
    this.selectedExercise =
      this.exercises.find(e => e.id === this.selectedExerciseId) || null;

    if (!this.selectedExercise) {
      this.history = [];
      return;
    }

    const allSets = await this.progression.getExerciseHistory(
      this.selectedExerciseId,
      100
    );

    this.history = allSets
      .filter(set => set.completed)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

    this.bestWeight = await this.progression.getBestWeight(this.selectedExerciseId);
    this.bestEstimated1RM =
      await this.progression.getBestEstimated1RM(this.selectedExerciseId);
    this.totalVolume =
      await this.progression.getTotalVolume(this.selectedExerciseId, 7);

    this.completedSetsCount = this.history.length;

    this.recommendation =
      await this.progression.getProgressionRecommendation(
        this.selectedExerciseId,
        3,
        10
      );
  }
}
