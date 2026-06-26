import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DbService } from './core/services/db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <mat-toolbar color="primary">
          <h1>💪 Training Tracker</h1>
        </mat-toolbar>
      </header>

      <main class="app-content">
        <router-outlet></router-outlet>
      </main>

      <nav class="app-navigation">
        <button
          mat-icon-button
          [routerLink]="['/dashboard']"
          (click)="navigate('/dashboard')"
          [class.active]="activeRoute === '/dashboard'"
        >
          <mat-icon>home</mat-icon>
          <span>Home</span>
        </button>
        <button
          mat-icon-button
          [routerLink]="['/exercises']"
          (click)="navigate('/exercises')"
          [class.active]="activeRoute === '/exercises'"
        >
          <mat-icon>fitness_center</mat-icon>
          <span>Exercises</span>
        </button>
        <button
          mat-icon-button
          [routerLink]="['/workout']"
          (click)="navigate('/workout')"
          [class.active]="activeRoute === '/workout'"
        >
          <mat-icon>play_circle_filled</mat-icon>
          <span>Workout</span>
        </button>
        <button
          mat-icon-button
          [routerLink]="['/history']"
          (click)="navigate('/history')"
          [class.active]="activeRoute === '/history'"
        >
          <mat-icon>history</mat-icon>
          <span>History</span>
        </button>
        <button
          mat-icon-button
          [routerLink]="['/settings']"
          (click)="navigate('/settings')"
          [class.active]="activeRoute === '/settings'"
        >
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </button>
      </nav>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .app-header {
      flex-shrink: 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .app-content {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 70px;
    }

    .app-navigation {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: var(--mdc-theme-surface, #fff);
      border-top: 1px solid rgba(0,0,0,0.1);
      height: 70px;
      gap: 0;
    }

    button {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 0.75rem;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    button.active {
      opacity: 1;
      background: rgba(63, 81, 181, 0.08);
    }

    button span {
      font-size: 0.65rem;
      display: block;
    }

    @media (max-width: 600px) {
      button span {
        display: none;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  activeRoute = '/dashboard';

  constructor(
    private db: DbService,
    private router: Router
  ) {}

  ngOnInit() {
    this.db.initializeDatabase();
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }

  navigate(route: string) {
    this.activeRoute = route;
  }
}
