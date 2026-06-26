import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DbService } from '../../core/services/db.service';
import {
  WorkoutSession,
  WorkoutSet,
  WorkoutTemplate,
  WorkoutTemplateExercise
} from '../../core/models/workout.model';

@Component({
  selector: 'app-workout-session',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule
  ],
  template: `
    <div class="workout-session-container" *ngIf="session && template">
      <h2>{{ session.workoutName }}</h2>

      <mat-card class="exercise-card" *ngIf="currentTemplateExercise">
        <mat-card-header>
          <mat-card-title>
            {{ currentTemplateExercise.exerciseName }}
          </mat-card-title>
          <mat-card-subtitle>
            Exercise {{ currentExerciseIndex + 1 }} of {{ templateExercises.length }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <p class="target">
            Target:
            {{ currentTemplateExercise.targetSets }} x
            {{ currentTemplateExercise.targetReps || 'max' }}
          </p>

          <div
            class="set-row"
            *ngFor="let set of currentSets; let i = index"
          >
            <div class="set-number">Set {{ set.setNumber }}</div>

            <mat-form-field appearance="outline">
              <mat-label>Weight</mat-label>
              <input
                matInput
                type="number"
                [(ngModel)]="set.weight"
                (ngModelChange)="saveSet(set)"
              >
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Reps</mat-label>
              <input
                matInput
                type="number"
                [(ngModel)]="set.reps"
                (ngModelChange)="saveSet(set)"
              >
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>RPE</mat-label>
              <input
                matInput
                type="number"
                min="1"
                max="10"
                [(ngModel)]="set.rpe"
                (ngModelChange)="saveSet(set)"
              >
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Pain</mat-label>
              <input
                matInput
                type="number"
                min="0"
                max="10"
                [(ngModel)]="set.painLevel"
                (ngModelChange)="saveSet(set)"
              >
            </mat-form-field>

            <mat-checkbox
              [(ngModel)]="set.completed"
              (change)="saveSet(set)"
            >
              Done
            </mat-checkbox>
          </div>

          <button mat-button color="primary" (click)="addSet()">
            + Add Set
          </button>
        </mat-card-content>

        <mat-card-actions class="actions">
          <button
            mat-button
            (click)="previousExercise()"
            [disabled]="currentExerciseIndex === 0"
          >
            Previous
          </button>

          <button
            mat-raised-button
            color="primary"
            (click)="nextExercise()"
            *ngIf="currentExerciseIndex < templateExercises.length - 1"
          >
            Next
          </button>

          <button
            mat-raised-button
            color="accent"
            (click)="finishWorkout()"
            *ngIf="currentExerciseIndex === templateExercises.length - 1"
          >
            Finish Workout
          </button>
        </mat-card-actions>
      </mat-card>
    </div>

    <div class="empty-state" *ngIf="!session || !template">
      Loading workout...
    </div>
  `,
  styles: [`
    .workout-session-container {
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }

    h2 {
      margin-top: 0;
    }

    .exercise-card {
      margin-bottom: 16px;
    }

    .target {
      font-weight: 600;
      margin-bottom: 16px;
    }

    .set-row {
      display: grid;
      grid-template-columns: 70px 1fr 1fr;
      gap: 10px;
      align-items: center;
      margin-bottom: 12px;
    }

    .set-number {
      font-weight: 600;
    }

    mat-checkbox {
      grid-column: span 3;
    }

    .actions {
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }

    .empty-state {
      padding: 32px 16px;
      text-align: center;
      opacity: 0.7;
    }

    @media (max-width: 520px) {
      .set-row {
        grid-template-columns: 1fr 1fr;
      }

      .set-number {
        grid-column: span 2;
      }

      mat-checkbox {
        grid-column: span 2;
      }
    }
  `]
})
export class WorkoutSessionComponent implements OnInit {
  session: WorkoutSession | null = null;
  template: WorkoutTemplate | null = null;

  templateExercises: WorkoutTemplateExercise[] = [];
  workoutSets: WorkoutSet[] = [];

  currentExerciseIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DbService
  ) {}

  get currentTemplateExercise(): WorkoutTemplateExercise | null {
    return this.templateExercises[this.currentExerciseIndex] || null;
  }

  get currentSets(): WorkoutSet[] {
    const exerciseId = this.currentTemplateExercise?.exerciseId;

    if (!exerciseId) {
      return [];
    }

    return this.workoutSets
      .filter(set => set.exerciseId === exerciseId)
      .sort((a, b) => a.setNumber - b.setNumber);
  }

  async ngOnInit(): Promise<void> {
    const sessionId = this.route.snapshot.paramMap.get('id');

    if (!sessionId) {
      return;
    }

    await this.loadSession(sessionId);
  }

  async loadSession(sessionId: string): Promise<void> {
    const session = await this.db.workoutSessions.get(sessionId);

    if (!session) {
      return;
    }

    this.session = session;

    const template = await this.db.workoutTemplates.get(session.templateId);

    if (!template) {
      return;
    }

    this.template = template;
    this.templateExercises = [...(template.exercises || [])].sort(
      (a, b) => a.order - b.order
    );

    this.workoutSets = await this.db.workoutSets
      .where('sessionId')
      .equals(session.id)
      .toArray();

    if (this.workoutSets.length === 0) {
      await this.createInitialSets();
    }
  }

  async createInitialSets(): Promise<void> {
    if (!this.session) return;

    const setsToAdd: WorkoutSet[] = [];

    for (const templateExercise of this.templateExercises) {
      for (let i = 1; i <= templateExercise.targetSets; i++) {
        setsToAdd.push({
          id: crypto.randomUUID(),
          sessionId: this.session.id,
          exerciseId: templateExercise.exerciseId,
          exerciseName: templateExercise.exerciseName,
          setNumber: i,
          reps: templateExercise.targetReps || 0,
          weight: templateExercise.defaultWeight,
          unit: templateExercise.unit,
          rpe: 0,
          painLevel: 0,
          completed: false,
          notes: '',
          timestamp: new Date()
        });
      }
    }

    await this.db.workoutSets.bulkAdd(setsToAdd);
    this.workoutSets = await this.db.workoutSets
      .where('sessionId')
      .equals(this.session.id)
      .toArray();
  }

  async saveSet(set: WorkoutSet): Promise<void> {
    set.timestamp = new Date();
    await this.db.workoutSets.put(set);
  }

  async addSet(): Promise<void> {
    if (!this.session || !this.currentTemplateExercise) return;

    const currentSets = this.currentSets;

    const newSet: WorkoutSet = {
      id: crypto.randomUUID(),
      sessionId: this.session.id,
      exerciseId: this.currentTemplateExercise.exerciseId,
      exerciseName: this.currentTemplateExercise.exerciseName,
      setNumber: currentSets.length + 1,
      reps: this.currentTemplateExercise.targetReps || 0,
      weight: this.currentTemplateExercise.defaultWeight,
      unit: this.currentTemplateExercise.unit,
      rpe: 0,
      painLevel: 0,
      completed: false,
      notes: '',
      timestamp: new Date()
    };

    await this.db.workoutSets.add(newSet);
    this.workoutSets.push(newSet);
  }

  previousExercise(): void {
    if (this.currentExerciseIndex > 0) {
      this.currentExerciseIndex--;
    }
  }

  nextExercise(): void {
    if (this.currentExerciseIndex < this.templateExercises.length - 1) {
      this.currentExerciseIndex++;
    }
  }

  async finishWorkout(): Promise<void> {
    if (!this.session) return;

    const endTime = new Date();
    const startTime = new Date(this.session.startTime);

    this.session.endTime = endTime;
    this.session.durationMinutes = Math.round(
      (endTime.getTime() - startTime.getTime()) / 60000
    );
    this.session.completed = true;

    await this.db.workoutSessions.put(this.session);

    await this.router.navigate(['/history']);
  }
}
