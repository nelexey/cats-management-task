import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'cats', 
    loadComponent: () => import('./cats/cats.component').then(m => m.CatsComponent) 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];