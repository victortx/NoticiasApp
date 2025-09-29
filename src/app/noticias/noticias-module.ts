import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticiasRoutingModule } from './noticias-routing-module';
import { NoticiasComponent } from './noticias-component';
import { NavbarNoticiaComponent } from './navbar-noticia-component/navbar-noticia-component';
import {FormsModule} from '@angular/forms';
import { NoticiasDetalleComponent } from './noticias-detalle-component/noticias-detalle-component';


@NgModule({
  declarations: [
    NoticiasComponent,
    NavbarNoticiaComponent,
    NoticiasDetalleComponent
  ],
  imports: [
    CommonModule,
    NoticiasRoutingModule,
    FormsModule
  ]
})
export class NoticiasModule { }
