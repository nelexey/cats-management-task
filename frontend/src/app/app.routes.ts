import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'cats', 
    loadComponent: () => import('./cats/cats.component').then(m => m.CatsComponent) 
  },
  { 
    path: 'chats', 
    loadComponent: () => import('./chats/chats.component').then(m => m.ChatsComponent) 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];