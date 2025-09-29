import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordService} from '../../services/password.service';
import {matchValidator, passwordStrengthValidator} from '../../shared/validators';

@Component({
  selector: 'app-change-password-component',
  standalone: false,
  templateUrl: './change-password-component.html',
  styleUrl: './change-password-component.scss'
})
export class ChangePasswordComponent {
  isSubmitting = false;
  errorMsg = '';
  successMsg = '';

  form: FormGroup;

  constructor(private fb: FormBuilder, private password: PasswordService) {
    this.form = this.fb.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [passwordStrengthValidator()]],
      confirm: ['', [Validators.required, matchValidator('new_password')]]
    });

    this.form.get("new_password")!.valueChanges.subscribe(() => {
      this.form.get("confirm")!.updateValueAndValidity({ onlySelf: true });
    });
  }

  get f() { return this.form.controls; }

  submit() {
    this.errorMsg = ''; this.successMsg = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.isSubmitting = true;

    this.password.change({
      current_password: this.form.value.current_password!,
      new_password: this.form.value.new_password!
    }).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.successMsg = res?.detail || 'Contraseña cambiada correctamente.';
        this['form'].reset();
      },
      error: (err) => {
        this.isSubmitting = false;
        const e = err?.error;
        if (e?.errors) {
          this.errorMsg = e.errors.join(' ');
        } else {
          this.errorMsg = e?.detail || 'No se pudo cambiar la contraseña.';
        }
      }
    });
  }
}
