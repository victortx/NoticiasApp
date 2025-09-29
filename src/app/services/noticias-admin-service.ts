import { Injectable } from '@angular/core';
import {environment} from '../../enviroments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NoticiaAdmin, NoticiaAdminPayload, PagedResp} from '../../Types/NoticiasAdminTypes';

@Injectable({
  providedIn: 'root'
})
export class NoticiasAdminService {
  baseAPI = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  listar(opts?: { url?: string; authorId?: number }): Observable<PagedResp<NoticiaAdmin>> {
    if (opts?.url) {
      return this.http.get<PagedResp<NoticiaAdmin>>(opts.url);
    }
    let params = new HttpParams();
    if (opts?.authorId != null) {
      // si tu backend usa otro nombre (p.ej. "autor_id" o "mine=true"), ajusta aquí
      params = params.set('autor', String(opts.authorId));
    }
    return this.http.get<PagedResp<NoticiaAdmin>>(`${this.baseAPI}noticias/`, { params });
  }

  create(data: {
    titulo: string;
    descripcion?: string;
    cuerpo: string;
    categoria_id: number;              // enviamos ID
    fecha_publicacion?: string | null; // ISO
    hoja_estilo?: string;
    miniatura?: File | null;
    // autor: opcional; ideal que el backend tome request.user
  }): Observable<NoticiaAdmin> {
    const fd = this.buildFormData(data);
    return this.http.post<NoticiaAdmin>(`${this.baseAPI}noticias/`, fd);
  }

  update(id: number, data: {
    titulo: string;
    descripcion?: string;
    cuerpo: string;
    categoria_id: number;
    fecha_publicacion?: string | null;
    hoja_estilo?: string;
    miniatura?: File | null;  // si no mandas, se conserva; si mandas null en DRF, debes manejarlo en backend
  }): Observable<NoticiaAdmin> {
    const fd = this.buildFormData(data);
    return this.http.put<NoticiaAdmin>(`${this.baseAPI}noticias/${id}/`, fd);
  }

  private buildFormData(data: any): FormData {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined) return;
      if (k === 'miniatura') {
        if (v instanceof File) fd.append('miniatura', v); // solo si hay archivo nuevo
      } else if (k === 'categoria_id' && typeof v === 'number') {
        fd.append('categoria_id', String(v)); // id de categoría
      } else if (v === null) {
        fd.append(k, ''); // según cómo manejes null en tu serializer
      } else {
        fd.append(k, String(v));
      }
    });
    return fd;
  }
}
