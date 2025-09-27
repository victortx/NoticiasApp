import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Auth} from './auth';
import {LoginComponent} from './login-component/login-component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
