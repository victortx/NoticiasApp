import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NoticiasAdmin} from './noticias-admin';

const routes: Routes = [{
  path: '',
  component: NoticiasAdmin
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticiasAdminRoutingModule { }
