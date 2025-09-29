import { Component } from '@angular/core';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent {
  isSubmitting = false;
  form: FormGroup;
  errorMsg = '';

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }


  submit() {
    this.errorMsg = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.isSubmitting = true;
    this.auth.login(this.form.value as any).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: err => {
        this.errorMsg = err?.error?.detail || 'Credenciales inválidas';
        this.isSubmitting = false;
      }
    });
  }

  hasError(ctrl: 'email' | 'password', err: string) {
    const c = this.form.controls[ctrl];
    return c.touched && c.hasError(err);
  }
}
