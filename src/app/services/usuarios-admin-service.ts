import { Injectable } from '@angular/core';
import {environment} from '../../enviroments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PagedUsers, UsuarioAdmin} from '../../Types/UsuariosTypes';

@Injectable({
  providedIn: 'root'
})

export class UsuariosAdminService {

  private base = environment.apiBaseUrl;
  private endpoint = `${this.base}admin/usuarios/`;

  constructor(private http: HttpClient) {}

  listar(opts?: { url?: string; page?: number; page_size?: number; search?: string; role?: string; active?: boolean }):
    Observable<PagedUsers<UsuarioAdmin>> {
    if (opts?.url) {
      return this.http.get<PagedUsers<UsuarioAdmin>>(opts.url);
    }
    let params = new HttpParams();
    if (opts?.page != null)      params = params.set('page', String(opts.page));
    if (opts?.page_size != null) params = params.set('page_size', String(opts.page_size));
    if (opts?.search)            params = params.set('search', opts.search);
    if (opts?.role)              params = params.set('role', opts.role);
    if (opts?.active != null)    params = params.set('is_active', String(opts.active));
    return this.http.get<PagedUsers<UsuarioAdmin>>(this.endpoint, { params });
  }

  actualizarEstado(id: number, is_active: boolean): Observable<UsuarioAdmin | void> {
    return this.http.put<UsuarioAdmin | void>(`${this.endpoint}${id}/estado/`, { is_active });
  }

}
