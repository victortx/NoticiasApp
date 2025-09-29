import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NoticiasComponent} from './noticias-component';
import {NoticiasDetalleComponent} from './noticias-detalle-component/noticias-detalle-component';

const routes: Routes = [
    {
    path: '',
    component: NoticiasComponent,
    },
  {
    path: ':id',
    component: NoticiasDetalleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticiasRoutingModule { }
