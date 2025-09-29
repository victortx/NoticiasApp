import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordService} from '../../services/password.service';

@Component({
  selector: 'app-forgot-component',
  standalone: false,
  templateUrl: './forgot-component.html',
  styleUrl: './forgot-component.scss'
})
export class ForgotComponent {
  isSubmitting = false;
  msg = '';
  errorMsg = '';

  form: FormGroup;

  constructor(private fb: FormBuilder, private password: PasswordService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.form.controls; }

  submit() {
    this.msg = ''; this.errorMsg = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSubmitting = true;
    this.password.forgot(this.form.value.email!)
      .subscribe({
        next: (res) => {
          this.msg = res?.detail || 'Si el correo existe, recibirás instrucciones.';
          this.isSubmitting = false;
        },
        error: () => {
          this.msg = 'Si el correo existe, recibirás instrucciones.';
          this.isSubmitting = false;
        }
      });
  }
}
