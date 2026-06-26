import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { DbService } from '../../core/services/db.service';
import { ProgressionService } from '../../core/services/progression.service';
import { WorkoutSession, WorkoutSet } from '../../core/models/workout.model';
import { Exercise, WorkoutTemplateExercise } from '../../core/models/exercise.model';

@Component({
  selector: 'app-workout-session',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSliderModule
  ],
  template: `
    <div class="session-container" *ngIf="session">
      <h2>{{ session.workoutName }}</h2>

      <mat-card class="progress-card">
        <mat-card-content>
          <div class="progress-label">
            Exercise {{ currentExerciseIndex + 1 }} of {{ templateExercises.length }}
          </div>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progressPercent"></div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="exercise-card" *ngIf="currentExercise && currentTemplateExercise">
        <mat-card-header>
          <mat-card-title>{{ currentExercise.name }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="exercise-info">
            <div class="info-item">
              <span class="label">Target:</span>
              <span class="value">{{ currentTemplateExercise.targetSets }}x{{ currentTemplateExercise.targetReps }}</span>
            </div>
            <div class="info-item" *ngIf="currentTemplateExercise.defaultWeight">
              <span class="label">Default Weight:</span>
              <span class="value">{{ currentTemplateExercise.defaultWeight }} {{ weightUnit }}</span>
            </div>
            <div class="info-item" *ngIf="currentTemplateExercise.restSeconds">
              <span class="label">Rest Time:</span>
              <span class="value">{{ currentTemplateExercise.restSeconds }}s</span>
            </div>
          </div>

          <div class="sets-container">
            <div *ngFor="let set of currentSets; let i = index" class="set-row">
              <mat-card class="set-card">
                <mat-card-content>
                  <div class="set-header">
                    <span class="set-number">Set {{ i + 1 }}</span>
                    <mat-checkbox [(ngModel)]="set.completed"></mat-checkbox>
                  </div>

                  <div class="set-inputs">
                    <mat-form-field appearance="outline">
                      <mat-label>Weight</mat-label>
                      <input matInput type="number" [(ngModel)]="set.weight" />
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Reps</mat-label>
                      <input matInput type="number" [(ngModel)]="set.reps" />
                    </mat-form-field>
                  </div>

                  <div class="set-inputs">
                    <mat-form-field appearance="outline">
                      <mat-label>RPE (1-10)</mat-label>
                      <input matInput type="number" min="1" max="10" [(ngModel)]="set.rpe" />
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Pain (0-10)</mat-label>
                      <input matInput type="number" min="0" max="10" [(ngModel)]="set.painLevel" />
                    </mat-form-field>
                  </div>

                  <div class="pain-indicator" [ngClass]="getPainClass(set.painLevel)">
                    {{ getPainText(set.painLevel) }}
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>

          <div class="action-buttons">
            <button mat-raised-button (click)="addSet()">
              <mat-icon>add</mat-icon>
              Add Set
            </button>
          </div>

          <div class="notes-section">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notes</mat-label>
              <textarea matInput [(ngModel)]="currentExerciseNotes"></textarea>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="navigation-buttons">
        <button mat-raised-button [disabled]="currentExerciseIndex === 0" (click)="previousExercise()">
          <mat-icon>arrow_back</mat-icon>
          Previous
        </button>
        <button
          mat-raised-button
          color="accent"
          [disabled]="currentExerciseIndex === templateExercises.length - 1"
          (click)="nextExercise()"
        >
          Next
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>

      <div class="finish-button">
        <button mat-raised-button color="primary" (click)="finishWorkout()">
          <mat-icon>check_circle</mat-icon>
          Finish Workout
        </button>
      </div>
    </div>
  `,
  styles: [`
    .session-container {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    h2 {
      margin-top: 0;
    }

    .progress-card {
      margin-bottom: 20px;
    }

    .progress-label {
      font-size: 0.875rem;
      color: rgba(0,0,0,0.6);
      margin-bottom: 8px;
    }

    .progress-bar {
      height: 8px;
      background: rgba(0,0,0,0.1);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4caf50, #2196f3);
      transition: width 0.3s ease;
    }

    .exercise-card {
      margin-bottom: 20px;
    }

    .exercise-info {
      background: rgba(0,0,0,0.05);
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
    }

    .value {
      font-weight: bold;
      color: #1976d2;
    }

    .sets-container {
      margin: 20px 0;
    }

    .set-card {
      margin-bottom: 12px;
      background: rgba(63, 81, 181, 0.02);
    }

    .set-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }

    .set-number {
      font-weight: 600;
      font-size: 1rem;
    }

    .set-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }

    mat-form-field {
      width: 100%;
    }

    .full-width {
      width: 100%;
    }

    .pain-indicator {
      padding: 8px;
      border-radius: 4px;
      text-align: center;
      font-weight: 600;
      margin-top: 12px;
      font-size: 0.875rem;
    }

    .pain-indicator.good {
      background: rgba(76, 175, 80, 0.2);
      color: #2e7d32;
    }

    .pain-indicator.caution {
      background: rgba(255, 193, 7, 0.2);
      color: #f57f17;
    }

    .pain-indicator.warning {
      background: rgba(244, 67, 54, 0.2);
      color: #c62828;
    }

    .notes-section {
      margin-top: 20px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }

    button {
      flex: 1;
    }

    .navigation-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 20px 0;
    }

    .finish-button {
      margin-top: 20px;
    }

    .finish-button button {
      width: 100%;
      height: 56px;
      font-size: 1.1rem;
    }
  `]
})
export class WorkoutSessionComponent implements OnInit {
  session: WorkoutSession | null = null;
  templateExercises: WorkoutTemplateExercise[] = [];
  currentExerciseIndex = 0;
  currentExercise: Exercise | null = null;
  currentTemplateExercise: WorkoutTemplateExercise | null = null;
  currentSets: WorkoutSet[] = [];
  currentExerciseNotes = '';
  weightUnit = 'lb';
  progressPercent = 0;

  constructor(
    private db: DbService,
    private progression: ProgressionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');
    if (sessionId) {
      await this.loadSession(parseInt(sessionId));
    }
  }

  async loadSession(sessionId: number) {
    this.session = await this.db.workoutSessions.get(sessionId);
    if (!this.session) return;

    // Load settings
    const settings = await this.db.getSettings();
    this.weightUnit = settings.weightUnit;

    // Load template exercises
    this.templateExercises = await this.db.workoutTemplateExercises
      .where('templateId')
      .equals(this.session.templateId)
      .toArray();

    this.templateExercises.sort((a, b) => a.order - b.order);

    // Load first exercise
    await this.loadExercise(0);
  }

  async loadExercise(index: number) {
    this.currentExerciseIndex = index;
    this.currentTemplateExercise = this.templateExercises[index];

    if (!this.currentTemplateExercise) return;

    this.currentExercise = await this.db.exercises.get(this.currentTemplateExercise.exerciseId);
    await this.loadCurrentSets();
    this.updateProgress();
  }

  async loadCurrentSets() {
    if (!this.session || !this.currentTemplateExercise) return;

    this.currentSets = await this.db.workoutSets
      .where('sessionId')
      .equals(this.session.id as any)
      .filter(s => s.exerciseId === this.currentTemplateExercise!.exerciseId)
      .toArray();

    // If no sets exist, create default sets
    if (this.currentSets.length === 0) {
      for (let i = 0; i < this.currentTemplateExercise.targetSets; i++) {
        const set: WorkoutSet = {
          id: this.generateId(),
          sessionId: this.session.id,
          exerciseId: this.currentTemplateExercise.exerciseId,
          exerciseName: this.currentExercise?.name || '',
          setNumber: i + 1,
          reps: typeof this.currentTemplateExercise.targetReps === 'string' ? 0 : this.currentTemplateExercise.targetReps,
          weight: this.currentTemplateExercise.defaultWeight,
          unit: this.weightUnit as 'lb' | 'kg',
          rpe: 7,
          painLevel: 0,
          completed: false,
          notes: '',
          timestamp: new Date()
        };
        this.currentSets.push(set);
      }
    }
  }

  async saveSets() {
    for (const set of this.currentSets) {
      await this.db.workoutSets.put(set);
    }
  }

  addSet() {
    if (!this.currentTemplateExercise) return;

    const newSet: WorkoutSet = {
      id: this.generateId(),
      sessionId: this.session!.id,
      exerciseId: this.currentTemplateExercise.exerciseId,
      exerciseName: this.currentExercise?.name || '',
      setNumber: this.currentSets.length + 1,
      reps: typeof this.currentTemplateExercise.targetReps === 'string' ? 0 : this.currentTemplateExercise.targetReps,
      weight: this.currentTemplateExercise.defaultWeight,
      unit: this.weightUnit as 'lb' | 'kg',
      rpe: 7,
      painLevel: 0,
      completed: false,
      notes: '',
      timestamp: new Date()
    };

    this.currentSets.push(newSet);
  }

  async nextExercise() {
    await this.saveSets();
    if (this.currentExerciseIndex < this.templateExercises.length - 1) {
      await this.loadExercise(this.currentExerciseIndex + 1);
    }
  }

  async previousExercise() {
    await this.saveSets();
    if (this.currentExerciseIndex > 0) {
      await this.loadExercise(this.currentExerciseIndex - 1);
    }
  }

  async finishWorkout() {
    if (!this.session) return;

    await this.saveSets();

    this.session.endTime = new Date();
    this.session.completed = true;
    if (this.session.startTime) {
      this.session.durationMinutes = Math.round(
        (this.session.endTime.getTime() - this.session.startTime.getTime()) / 60000
      );
    }

    await this.db.workoutSessions.update(this.session.id as any, this.session);
    this.router.navigate(['/dashboard']);
  }

  updateProgress() {
    this.progressPercent = ((this.currentExerciseIndex + 1) / this.templateExercises.length) * 100;
  }

  getPainClass(painLevel: number): string {
    if (painLevel >= 7) return 'warning';
    if (painLevel >= 4) return 'caution';
    return 'good';
  }

  getPainText(painLevel: number): string {
    if (painLevel === 0) return 'No pain ✓';
    if (painLevel <= 3) return 'Mild - OK';
    if (painLevel <= 6) return 'Caution ⚠';
    return 'Stop or Replace ⚠⚠';
  }

  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
