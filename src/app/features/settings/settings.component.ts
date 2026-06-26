import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { DbService } from '../../core/services/db.service';
import { BackupService } from '../../core/services/backup.service';
import { AppSettings } from '../../core/models/settings.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatInputModule
  ],
  template: `
    <div class="settings-container">
      <h2>Settings</h2>

      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>Preferences</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="setting-item">
            <label>Weight Unit</label>
            <mat-form-field appearance="outline">
              <mat-select [(ngModel)]="settings.weightUnit" (change)="saveSettings()">
                <mat-option value="lb">Pounds (lb)</mat-option>
                <mat-option value="kg">Kilograms (kg)</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="setting-item">
            <label>Theme</label>
            <mat-form-field appearance="outline">
              <mat-select [(ngModel)]="settings.theme" (change)="saveSettings()">
                <mat-option value="light">Light</mat-option>
                <mat-option value="dark">Dark</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="setting-item">
            <label>Default Rest Time (seconds)</label>
            <mat-form-field appearance="outline">
              <input matInput type="number" [(ngModel)]="settings.defaultRestSeconds" (change)="saveSettings()" />
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-divider></mat-divider>

      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>Backup & Restore</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="description">Export all your training data as JSON or import from a backup file.</p>

          <div class="backup-buttons">
            <button mat-raised-button (click)="exportBackup()">
              Download Backup
            </button>
            <button mat-raised-button (click)="triggerFileInput()">
              Restore from Backup
            </button>
            <input
              #fileInput
              type="file"
              accept=".json"
              (change)="importBackup($event)"
              style="display: none"
            />
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="settings-card danger">
        <mat-card-header>
          <mat-card-title>Danger Zone</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="description warning">This action cannot be undone!</p>
          <button mat-raised-button color="warn" (click)="clearAllData()">
            Clear All Data
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .settings-card {
      margin: 16px 0;
    }

    .setting-item {
      margin-bottom: 20px;
    }

    .setting-item label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
    }

    mat-form-field {
      width: 100%;
    }

    .description {
      font-size: 0.875rem;
      color: rgba(0,0,0,0.6);
      margin-bottom: 16px;
    }

    .description.warning {
      color: #d32f2f;
      font-weight: 600;
    }

    .backup-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    button {
      width: 100%;
      height: 44px;
    }

    .danger {
      background: rgba(244, 67, 54, 0.05);
      border-left: 4px solid #f44336;
    }
  `]
})
export class SettingsComponent implements OnInit {
  settings: AppSettings = {
    id: '',
    weightUnit: 'lb',
    theme: 'dark',
    defaultRestSeconds: 90,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  constructor(
    private db: DbService,
    private backup: BackupService
  ) {}

  async ngOnInit() {
    this.settings = await this.db.getSettings();
  }

  async saveSettings() {
    await this.db.updateSettings(this.settings);
  }

  exportBackup() {
    this.backup.downloadBackup();
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  async importBackup(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const jsonString = e.target?.result as string;
        await this.backup.importData(jsonString);
        alert('Backup imported successfully!');
        location.reload();
      } catch (error) {
        alert('Error importing backup: ' + (error as any).message);
      }
    };

    reader.readAsText(file);
  }

  async clearAllData() {
    if (confirm('Are you REALLY sure? This will delete all your data and cannot be undone!')) {
      await this.db.clearAllData();
      alert('All data cleared. Refreshing...');
      location.reload();
    }
  }
}
