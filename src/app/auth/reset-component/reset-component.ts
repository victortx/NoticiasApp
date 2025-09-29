import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PasswordService} from '../../services/password.service';
import {matchValidator, passwordStrengthValidator} from '../../shared/validators';

@Component({
  selector: 'app-reset-component',
  standalone: false,
  templateUrl: './reset-component.html',
  styleUrl: './reset-component.scss'
})
export class ResetComponent implements OnInit {
  uid = '';
  token = '';
  isSubmitting = false;
  errorMsg = '';
  successMsg = '';

  form: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private password: PasswordService) {
    this.form = this.fb.group({
      password: ['', [passwordStrengthValidator()]],
      confirm: ['', [Validators.required, matchValidator('password')]]
    });


    this.form.get('password')!.valueChanges.subscribe(() => {
      this.form.get('confirm')!.updateValueAndValidity({ onlySelf: true });
    });
  }

  ngOnInit(): void {
    this.uid = this.route.snapshot.queryParamMap.get('uid') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  get f() { return this.form.controls; }

  submit() {
    this['errorMsg'] = ''; this.successMsg = '';
    if (!this.uid || !this.token) { this.errorMsg = 'Enlace inválido.'; return; }
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.isSubmitting = true;
    this.password.reset({ uid: this.uid, token: this.token, password: this.form.value.password! })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.successMsg = 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.';
          setTimeout(() => this.router.navigateByUrl('/auth/login'), 1200);
        },
        error: (err) => {
          this.isSubmitting = false;
          const e = err?.error;
          if (e?.errors) {
            // backend puede devolver {valid:false, errors:[...]}
            this.errorMsg = e.errors.join(' ');
          } else {
            this.errorMsg = e?.detail || 'No se pudo actualizar la contraseña.';
          }
        }
      });
  }

}
