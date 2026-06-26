import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DbService } from '../../core/services/db.service';
import { WorkoutTemplate } from '../../core/models/workout.model';
import { WorkoutSession } from '../../core/models/workout.model';

@Component({
  selector: 'app-workout-start',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="workout-start-container">
      <h2>Select Workout Template</h2>

      <div class="templates-list">
        <mat-card *ngFor="let template of templates" class="template-card">
          <mat-card-header>
            <mat-card-title>{{ template.name }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ template.description }}</p>
            <div class="exercise-count">
              <mat-icon>fitness_center</mat-icon>
              {{ template.exercises.length }} exercises
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="accent" (click)="startWorkout(template)">
              Start Workout
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="templates.length === 0" class="no-data">
        No workout templates found. Create one in the Templates section.
      </div>
    </div>
  `,
  styles: [`
    .workout-start-container {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .templates-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .template-card {
      margin-bottom: 8px;
    }

    .exercise-count {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      font-size: 0.9rem;
      color: rgba(0,0,0,0.6);
    }

    mat-card-actions {
      padding: 12px;
    }

    button {
      width: 100%;
    }

    .no-data {
      text-align: center;
      padding: 40px 16px;
      color: rgba(0,0,0,0.6);
    }
  `]
})
export class WorkoutStartComponent implements OnInit {
  templates: WorkoutTemplate[] = [];

  constructor(
    private db: DbService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadTemplates();
  }

  async loadTemplates() {
    this.templates = await this.db.workoutTemplates.toArray();
  }

  async startWorkout(template: WorkoutTemplate) {
    // Create new workout session
    const session: WorkoutSession = {
      id: this.generateId(),
      templateId: template.id,
      workoutName: template.name,
      date: new Date(),
      startTime: new Date(),
      notes: '',
      completed: false
    };

    const sessionId = await this.db.workoutSessions.add(session);
    this.router.navigate(['/workout/session', sessionId]);
  }

  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
