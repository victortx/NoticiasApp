import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import {Auth} from './auth';
import {RouterOutlet} from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import {ReactiveFormsModule} from '@angular/forms';
import { Registro } from './registro/registro';
import {RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha';
import { ForgotComponent } from './forgot-component/forgot-component';
import { ResetComponent } from './reset-component/reset-component';
import { ChangePasswordComponent } from './change-password-component/change-password-component';


@NgModule({
  declarations: [
    Auth,
    LoginComponent,
    Registro,
    ForgotComponent,
    ResetComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    RouterOutlet,
    RecaptchaModule,
    RecaptchaFormsModule
  ]
})
export class AuthModule { }
