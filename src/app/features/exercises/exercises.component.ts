import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { DbService } from '../../core/services/db.service';
import { Exercise } from '../../core/models/exercise.model';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule
  ],
  template: `
    <div class="exercises-container">
      <h2>Exercise Library</h2>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Filter by Muscle Group</mat-label>
          <mat-select [(ngModel)]="selectedMuscleGroup">
            <mat-option value="">All</mat-option>
            <mat-option *ngFor="let muscle of muscleGroups" [value]="muscle">
              {{ muscle }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="exercises-list">
        <mat-card *ngFor="let exercise of filteredExercises" class="exercise-card">
          <mat-card-header>
            <mat-card-title>{{ exercise.name }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="exercise-detail">
              <strong>Primary:</strong> {{ exercise.primaryMuscleGroup }}
            </div>
            <div class="exercise-detail" *ngIf="exercise.secondaryMuscleGroups.length">
              <strong>Secondary:</strong> {{ exercise.secondaryMuscleGroups.join(', ') }}
            </div>
            <div class="exercise-detail" *ngIf="exercise.equipment.length">
              <strong>Equipment:</strong> {{ exercise.equipment.join(', ') }}
            </div>
            <div class="exercise-detail" *ngIf="exercise.injuryTags.length">
              <mat-chip-set aria-label="Injury tags">
                <mat-chip *ngFor="let tag of exercise.injuryTags" selected>
                  {{ tag }}
                </mat-chip>
              </mat-chip-set>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="filteredExercises.length === 0" class="no-data">
        No exercises found
      </div>
    </div>
  `,
  styles: [`
    .exercises-container {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .filters {
      margin-bottom: 20px;
    }

    mat-form-field {
      width: 100%;
    }

    .exercises-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .exercise-card {
      margin-bottom: 8px;
    }

    .exercise-detail {
      margin: 8px 0;
      font-size: 0.9rem;
    }

    .no-data {
      text-align: center;
      padding: 40px 16px;
      color: rgba(0,0,0,0.6);
    }
  `]
})
export class ExercisesComponent implements OnInit {
  exercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];
  selectedMuscleGroup = '';
  muscleGroups: string[] = [];

  constructor(private db: DbService) {}

  async ngOnInit() {
    await this.loadExercises();
  }

  async loadExercises() {
    this.exercises = await this.db.exercises.where('isActive').equals(true).toArray();
    this.muscleGroups = [...new Set(this.exercises.map(e => e.primaryMuscleGroup))].sort();
    this.filterExercises();
  }

  filterExercises() {
    if (!this.selectedMuscleGroup) {
      this.filteredExercises = this.exercises;
    } else {
      this.filteredExercises = this.exercises.filter(
        e => e.primaryMuscleGroup === this.selectedMuscleGroup
      );
    }
  }
}
