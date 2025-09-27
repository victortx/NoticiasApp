import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import {Auth} from './auth';
import {RouterOutlet} from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    Auth,
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    RouterOutlet
  ]
})
export class AuthModule { }
