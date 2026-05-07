import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, 
    MatCardModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSnackBarModule,
    MatProgressBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoginMode = true;
  isLoading = false;
  credentials = { username: '', password: '' };

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (!this.credentials.username || !this.credentials.password) {
      this.showError('Заполните все поля');
      return;
    }

    this.isLoading = true;

    if (this.isLoginMode) {
      this.authService.login(this.credentials).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Успешный вход!', 'Закрыть', { duration: 3000, panelClass: ['success-snackbar'] });
          this.router.navigate(['/cats']);
        },
        error: (err) => {
          this.isLoading = false;
          this.showError(err.error?.detail || 'Неверный логин или пароль');
        }
      });
    } else {
      this.authService.register(this.credentials).subscribe({
        next: () => {
          this.isLoading = false;
          this.isLoginMode = true;
          this.snackBar.open('Регистрация успешна! Теперь войдите.', 'Закрыть', { duration: 4000 });
        },
        error: (err) => {
          this.isLoading = false;
          const errorMsg = err.error?.username ? `Ошибка: ${err.error.username[0]}` : 'Ошибка регистрации';
          this.showError(errorMsg);
        }
      });
    }
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Закрыть', { duration: 5000 });
  }
}