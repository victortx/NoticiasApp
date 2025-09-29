import {Component, OnInit} from '@angular/core';
import {NoticaPublicoService, NoticiaPublica} from '../../services/notica-publico-service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {of, switchMap} from 'rxjs';

@Component({
  selector: 'app-noticias-detalle-component',
  standalone: false,
  templateUrl: './noticias-detalle-component.html',
  styleUrl: './noticias-detalle-component.scss'
})
export class NoticiasDetalleComponent implements OnInit  {
  categorias: Array<{ id: number; nombre: string; slug: string }> = [];
  noticia?: NoticiaPublica;
  recomendados: NoticiaPublica[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: NoticaPublicoService
  ) {}

  ngOnInit(): void {
    // Navbar
    this.api.listarCategorias({ page_size: 100, ordering: 'nombre' }).subscribe({
      next: res => this.categorias = res.results || [],
      error: () => this.categorias = []
    });

    // Cambios de :id
    this.route.paramMap.subscribe((params: ParamMap) => {
      const raw = params.get('id');
      const id = Number(raw);
      if (!id || Number.isNaN(id)) {
        this.error = 'Noticia no encontrada.';
        this.noticia = undefined;
        this.recomendados = [];
        this.loading = false;           // 👈 evita spinner pegado
        return;
      }

      this.loading = true;
      this.error = '';

      // Detalle
      this.api.obtenerNoticia(id).subscribe({
        next: n => {
          this.noticia = n;
          this.loading = false;         // 👈 quita el spinner al cargar la nota

          // Recomendados (independiente del spinner principal)
          this.api.recomendados(n.id).subscribe({
            next: r => this.recomendados = r.results || [],
            error: () => this.recomendados = []
          });
        },
        error: () => {
          this.error = 'No se pudo cargar la noticia.';
          this.loading = false;         // 👈 también en error
        }
      });
    });
  }

  trackById = (_: number, n: NoticiaPublica) => n.id;
  trackByCatId = (_: number, c: {id:number}) => c.id;
}
