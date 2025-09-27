import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminComponent} from './admin-component';

const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [{
      path: 'categorias',
        loadChildren: () => import('./categorias/categorias-module')
      .then(m => m.CategoriasModule)
    },
    {
      path: 'noticias',
      loadChildren: () => import('./noticias-admin/noticias-admin-module')
        .then(m => m.NoticiasAdminModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
