import {Component, OnInit} from '@angular/core';
import {NoticaPublicoService, NoticiaPublica} from '../services/notica-publico-service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-noticias-component',
  standalone: false,
  templateUrl: './noticias-component.html',
  styleUrl: './noticias-component.scss'
})
export class NoticiasComponent implements OnInit {
  categorias: Array<{ id: number; nombre: string; slug: string }> = [];
  activeCat: { id: number; nombre: string; slug: string } | null = null;

  data?: { count: number; next: string | null; previous: string | null; results: any[]; };
  loading = false;
  error = '';
  search = '';
  ordering = '-fecha_publicacion';

  constructor(private noticiasService: NoticaPublicoService, private router: ActivatedRoute) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.fetch();
    this.router.queryParamMap.subscribe(q => {
      const cat = Number(q.get('cat'));
      this.activeCat = cat ? this.categorias.find(x => x.id === cat) || { id: cat, nombre: '', slug: '' } : null;
      this.fetch();
    });
  }

  cargarCategorias() {
    this.noticiasService.listarCategorias({ page_size: 100, ordering: 'nombre' })
      .subscribe({
        next: (res) => this.categorias = res?.results || [],
        error: () => this.categorias = []
      });
  }

  setCategory(cat: any | null) {
    this.activeCat = cat;
  }

  fetch(url?: string) {
    this.loading = true;
    this.error = '';

    const opts = url
      ? { url } // usa next/previous absolutas
      : {
        categoria: this.activeCat?.id,
        search: this.search?.trim() || undefined,
        ordering: this.ordering
      };

    this.noticiasService.listarNoticias(opts).subscribe({
      next: (res) => this.data = res,
      error: () => this.error = 'Error cargando noticias.',
      complete: () => this.loading = false
    });
  }

  next() { if (this.data?.next) this.fetch(this.data.next); }
  prev() { if (this.data?.previous) this.fetch(this.data.previous); }

  trackById = (_: number, n: NoticiaPublica) => n.id;
  trackByCatId = (_: number, c: {id:number}) => c.id;


}
