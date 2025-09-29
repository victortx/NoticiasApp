import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Auth} from './auth';
import {LoginComponent} from './login-component/login-component';
import {Registro} from './registro/registro';
import {ForgotComponent} from './forgot-component/forgot-component';
import {ResetComponent} from './reset-component/reset-component';
import {ChangePasswordComponent} from './change-password-component/change-password-component';

const routes: Routes = [
  {
    path: '',
    component: Auth,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { returnUrl: window.location.pathname },
      }, {
        path: 'registro',
        component: Registro,
      },
      { path: 'forgot', component: ForgotComponent },
      { path: 'reset', component: ResetComponent },
      { path: 'change-password', component: ChangePasswordComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
