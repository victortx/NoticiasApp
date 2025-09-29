import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {NoticiaAdmin, PagedResp} from '../../Types/NoticiasAdminTypes';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../enviroments/environment';
import {PagedResponse} from '../../Types/AuthTypes';
import {Categoria} from '../../Types/categoriasType';

interface Paged<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface NoticiaPublica {
  id: number;
  slug: string;
  miniatura: string | null;
  titulo: string;
  descripcion: string;
  cuerpo: string;
  autor: number;
  autor_nombre?: string;
  categoria?: { id: number; nombre: string; slug: string };
  fecha_publicacion: string | null;
  fecha_creacion: string;
  hoja_estilo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticaPublicoService {

  baseAPI = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}


  listarNoticias(opts?: {
    url?: string;
    categoria?: number;
    search?: string;
    ordering?: string;
    page?: number;
  }): Observable<Paged<any>> {
    if (opts?.url) {
      // Usa la URL absoluta de next/previous (tu backend debe permitir CORS si es otro host)
      return this.http.get<Paged<any>>(opts.url);
    }
    let params = new HttpParams();
    if (opts?.categoria != null) params = params.set('categoria', String(opts.categoria));
    if (opts?.search)          params = params.set('search', opts.search);
    if (opts?.ordering)        params = params.set('ordering', opts.ordering);
    if (opts?.page != null)    params = params.set('page', String(opts.page));

    return this.http.get<Paged<any>>(`${this.baseAPI}noticias/`, { params });
  }

  listarCategorias(opts?: { page?: number; page_size?: number; search?: string; ordering?: string }): Observable<Paged<any>> {
    let params = new HttpParams();
    if (opts?.page != null)      params = params.set('page', String(opts.page));
    if (opts?.page_size != null) params = params.set('page_size', String(opts.page_size));
    if (opts?.search)            params = params.set('search', opts.search);
    if (opts?.ordering)          params = params.set('ordering', opts.ordering);
    return this.http.get<Paged<any>>(`${this.baseAPI}categorias/`, { params });
  }

  obtenerNoticia(id: number): Observable<NoticiaPublica> {
    return this.http.get<NoticiaPublica>(`${this.baseAPI}noticias/${id}/`);
  }

  recomendados(id: number): Observable<Paged<NoticiaPublica>> {
    return this.http.get<Paged<NoticiaPublica>>(`${this.baseAPI}noticias/${id}/recomendados/`);
  }

}
