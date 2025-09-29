import { Component } from '@angular/core';
import {environment} from '../../../enviroments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth-service';
import {Router} from '@angular/router';
import {matchValidator, passwordStrengthValidator, phoneDigitsValidator} from '../../shared/validators';
import {FacebookAuthService} from '../../services/facebook-auth-service';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {
  siteKey = environment.recaptcha.siteKey;
  isSubmitting = false;
  errorMsg = '';
  successMsg = '';
  fbError = '';

  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,
              private fbAuth: FacebookAuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [phoneDigitsValidator(8, 15)]], // opcional
      password: ['', [passwordStrengthValidator()]],
      confirm_password: ['', [Validators.required, matchValidator('password')]],
      recaptcha: [environment.recaptcha.enabled ? '' : null,
        environment.recaptcha.enabled ? [Validators.required] : []],
    });

    this.form.get("password")!.valueChanges.subscribe(() => {
      this.form.get("confirm_password")!.updateValueAndValidity({ onlySelf: true });
    });
  }


  get f() { return this.form.controls; }

  submit() {
    this.errorMsg = '';
    this.successMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      email: this.form.value.email!,
      first_name: this.form.value.first_name!,
      last_name: this.form.value.last_name!,
      telefono: this.form.value.telefono || '',
      password: this.form.value.password!,
    };

    this.auth.register(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMsg = `Cuenta creada para ${res.first_name} ${res.last_name}.`;
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 1200);
      },
      error: (err) => {
        this.isSubmitting = false;

        // Manejo de 400 con errores de campo (DRF)
        const e = err?.error;
        if (e && typeof e === 'object') {
          // Si llegan errores por campo: {email:["..."], password:["..."]}
          (['email','first_name','last_name','telefono','password'] as const).forEach(k => {
            if (e[k]?.length) this.form.get(k)?.setErrors({ server: e[k][0] });
          });
        }
        this.errorMsg = e?.detail || 'No se pudo crear la cuenta.';
      }
    });
  }

  get passwordState() {
    const e = this.f['password'].errors as any;
    if (!e) return { lenOk: true, hasLower: true, hasUpper: true, hasDigit: true, hasSpecial: true };
    if (!e.weak) return { lenOk: false, hasLower: false, hasUpper: false, hasDigit: false, hasSpecial: false };
    return e.weak;
  }

  async continueWithFacebook() {
    this.fbError = '';
    this.isSubmitting = true;
    try {
      const { accessToken, profile } = await this.fbAuth.login();
      await this.auth.facebookRegister({
        fb_access_token: accessToken,
      }).toPromise();
      alert('Te enviamos una contraseña temporal y un enlace de verificación a tu correo.');
    } catch (err: any) {
      this.fbError = err?.message || 'No se pudo continuar con Facebook.';
    } finally {
      this.isSubmitting = false;
    }
  }

}
