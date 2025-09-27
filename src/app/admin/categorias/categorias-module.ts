import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriasRoutingModule } from './categorias-routing-module';
import { Categorias } from './categorias';
import { CategoriasCreateModal } from './categorias-create-modal/categorias-create-modal';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    Categorias,
    CategoriasCreateModal
  ],
  imports: [
    CommonModule,
    CategoriasRoutingModule,
    ReactiveFormsModule
  ]
})
export class CategoriasModule { }
