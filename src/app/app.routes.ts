import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'exercises',
    loadComponent: () => import('./features/exercises/exercises.component').then(m => m.ExercisesComponent)
  },
  {
    path: 'templates',
    loadComponent: () => import('./features/templates/templates.component').then(m => m.TemplatesComponent)
  },
  {
    path: 'workout',
    loadComponent: () => import('./features/workout/workout-start.component').then(m => m.WorkoutStartComponent)
  },
  {
    path: 'workout/session/:id',
    loadComponent: () => import('./features/workout/workout-session.component').then(m => m.WorkoutSessionComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./features/history/history.component').then(m => m.HistoryComponent)
  },
  {
    path: 'progress',
    loadComponent: () => import('./features/progress/progress.component').then(m => m.ProgressComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
  }
];
