import {Component, OnInit, ViewChild} from '@angular/core';
import {CategoriasService} from '../../services/categorias-service';
import {Categoria} from '../../../Types/categoriasType';
import {PagedResponse} from '../../../Types/AuthTypes';
import {CategoriasCreateModal} from './categorias-create-modal/categorias-create-modal';

@Component({
  selector: 'app-categorias',
  standalone: false,
  templateUrl: './categorias.html',
  styleUrl: './categorias.scss'
})
export class Categorias implements OnInit {
  @ViewChild('crearModal') createModal!: CategoriasCreateModal;



  data?: PagedResponse<Categoria>;
  loading = false;
  error = '';

  constructor(private ServiceCategoria: CategoriasService) { }

  ngOnInit(): void {
    this.fetch();
  }

  fetch(url?: string) {
    this.loading = true;
    this.error = '';
    this.ServiceCategoria.listar(url).subscribe({
      next: res => this.data = res,
      error: () => this.error = 'Error cargando categorías.',
      complete: () => this.loading = false
    });
  }

  next() { if (this.data?.next) this.fetch(this.data.next); }
  prev() { if (this.data?.previous) this.fetch(this.data.previous); }

  trackById(_: number, c: Categoria) { return c.id; }

  openCrear(){
    this.createModal.open();
  }

  openEditar(c: Categoria) {
    this.createModal.openForEdit(c);
  }

  onUpdated() { this.fetch(); }

  onCreated() {
    // refresca la tabla al crear
    this.fetch();
  }

}
