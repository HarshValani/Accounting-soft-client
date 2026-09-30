import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'accounting'
  },
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'accounting',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/accounting/accounting-page/accounting-page.component').then(
        m => m.AccountingPageComponent
      )
  },
  {
    path: '**',
    redirectTo: 'accounting'
  }
];
