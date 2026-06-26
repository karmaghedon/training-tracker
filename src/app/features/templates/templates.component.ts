import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { DbService } from '../../core/services/db.service';
import { Exercise } from '../../core/models/exercise.model';
import {
  WorkoutTemplate,
  WorkoutTemplateExercise
} from '../../core/models/workout.model';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="templates-container">
      <h2>Workout Templates</h2>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Create Template</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <mat-form-field appearance="outline">
            <mat-label>Template Name</mat-label>
            <input matInput [(ngModel)]="newTemplateName">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <input matInput [(ngModel)]="newTemplateDescription">
          </mat-form-field>

          <button mat-raised-button (click)="createTemplate()">
            Create Template
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card *ngFor="let template of templates" class="template-card">
        <mat-card-header>
          <mat-card-title>{{ template.name }}</mat-card-title>
          <mat-card-subtitle>{{ template.description }}</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-form-field appearance="outline">
            <mat-label>Add Exercise</mat-label>
            <mat-select [(ngModel)]="selectedExerciseId">
              <mat-option *ngFor="let ex of exercises" [value]="ex.id">
                {{ ex.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-button (click)="addExercise(template)">
            Add Exercise
          </button>

          <mat-list>
            <mat-list-item *ngFor="let ex of template.exercises">
              {{ getExerciseName(ex.exerciseId) }}
              — {{ ex.targetSets }}x{{ ex.targetReps }}
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .templates-container {
      padding: 16px;
      max-width: 800px;
      margin: auto;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 12px;
    }

    .template-card {
      margin-top: 20px;
    }
  `]
})
export class TemplatesComponent implements OnInit {
  templates: WorkoutTemplate[] = [];
  exercises: Exercise[] = [];

  newTemplateName = '';
  newTemplateDescription = '';
  selectedExerciseId = '';

  constructor(private db: DbService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.templates = await this.db.workoutTemplates.toArray();
    this.exercises = await this.db.exercises.toArray();
  }

  async createTemplate() {
    if (!this.newTemplateName.trim()) return;

    const template: WorkoutTemplate = {
      id: crypto.randomUUID(),
      name: this.newTemplateName,
      description: this.newTemplateDescription,
      exercises: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.db.workoutTemplates.add(template);

    this.newTemplateName = '';
    this.newTemplateDescription = '';

    await this.loadData();
  }

  async addExercise(template: WorkoutTemplate) {
    if (!this.selectedExerciseId) return;

    const exercise: WorkoutTemplateExercise = {
      id: crypto.randomUUID(),
      templateId: template.id,
      exerciseId: this.selectedExerciseId,
      order: template.exercises.length + 1,
      targetSets: 3,
      targetReps: 10,
      defaultWeight: 0,
      restSeconds: 90,
      notes: ''
    };

    template.exercises.push(exercise);
    template.updatedAt = new Date().toISOString();

    await this.db.workoutTemplates.put(template);

    this.selectedExerciseId = '';
    await this.loadData();
  }

  getExerciseName(exerciseId: string): string {
    return this.exercises.find(e => e.id === exerciseId)?.name || 'Unknown';
  }
}
