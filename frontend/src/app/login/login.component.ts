import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginMode = true;
  credentials = { username: '', password: '' };

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.authService.login(this.credentials).subscribe({
        next: () => this.router.navigate(['/cats']),
        error: (err) => console.error('Login error', err)
      });
    } else {
      this.authService.register(this.credentials).subscribe({
        next: () => this.isLoginMode = true,
        error: (err) => console.error('Reg error', err)
      });
    }
  }
}