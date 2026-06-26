import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { DbService } from '../../core/services/db.service';
import { WorkoutTemplate, WorkoutSession } from '../../core/models/workout.model';

@Component({
  selector: 'app-workout-start',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  template: `
    <div class="workout-start-container">
      <h2>Start Workout</h2>

      <mat-card *ngFor="let template of templates" class="template-card">
        <mat-card-header>
          <mat-card-title>{{ template.name }}</mat-card-title>
          <mat-card-subtitle>
            {{ template.exercises?.length || 0 }} exercises
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <p>{{ template.description }}</p>

          <ul *ngIf="template.exercises?.length">
            <li *ngFor="let exercise of template.exercises">
              {{ exercise.exerciseName }}
              — {{ exercise.targetSets }}x{{ exercise.targetReps || 'max' }}
            </li>
          </ul>
        </mat-card-content>

        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            (click)="startWorkout(template)"
            [disabled]="!template.exercises || template.exercises.length === 0"
          >
            Start Workout
          </button>
        </mat-card-actions>
      </mat-card>

      <div *ngIf="templates.length === 0" class="empty-state">
        No workout templates found.
      </div>
    </div>
  `,
  styles: [`
    .workout-start-container {
      padding: 16px;
      max-width: 700px;
      margin: 0 auto;
    }

    .template-card {
      margin-bottom: 16px;
    }

    ul {
      padding-left: 20px;
      margin-bottom: 0;
    }

    li {
      margin-bottom: 6px;
    }

    .empty-state {
      text-align: center;
      padding: 32px 16px;
      opacity: 0.7;
    }
  `]
})
export class WorkoutStartComponent implements OnInit {
  templates: WorkoutTemplate[] = [];

  constructor(
    private db: DbService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadTemplates();
  }

  async loadTemplates(): Promise<void> {
    this.templates = await this.db.workoutTemplates.toArray();

    this.templates = this.templates
      .map(template => ({
        ...template,
        exercises: template.exercises || []
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async startWorkout(template: WorkoutTemplate): Promise<void> {
    const templateExercises = template.exercises || [];

    if (templateExercises.length === 0) {
      return;
    }

    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      templateId: template.id,
      workoutName: template.name,
      date: new Date(),
      startTime: new Date(),
      notes: '',
      completed: false
    };

    await this.db.workoutSessions.add(session);

    await this.router.navigate(['/workout/session', session.id]);
  }
}
