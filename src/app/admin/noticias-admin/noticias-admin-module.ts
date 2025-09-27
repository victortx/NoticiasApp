import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticiasAdminRoutingModule } from './noticias-admin-routing-module';
import { NoticiasAdmin } from './noticias-admin';
import { NoticiasEditModalComponent } from './noticias-edit-modal.component/noticias-edit-modal.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    NoticiasAdmin,
    NoticiasEditModalComponent
  ],
  imports: [
    CommonModule,
    NoticiasAdminRoutingModule,
    ReactiveFormsModule
  ]
})
export class NoticiasAdminModule { }
