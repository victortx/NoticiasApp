import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { AdminComponent } from './admin-component';
import { Sidebar } from './sidebar/sidebar';
import {AdminAuthInterceptor} from './interceptor/admin-auth-interceptor-interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {CategoriasService} from '../services/categorias-service';
import {NoticiasAdminService} from '../services/noticias-admin-service';
import {NoticiasEditModalComponent} from './noticias-admin/noticias-edit-modal.component/noticias-edit-modal.component';
import {UsuariosAdminService} from '../services/usuarios-admin-service';


@NgModule({
  declarations: [
    AdminComponent,
    Sidebar,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    AdminRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AdminAuthInterceptor, multi: true },
    CategoriasService, NoticiasAdminService, UsuariosAdminService
  ]
})
export class AdminModule { }
