import { Injectable } from '@angular/core';
import {environment} from '../../enviroments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PagedResponse} from '../../Types/AuthTypes';
import {Categoria} from '../../Types/categoriasType';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  baseAPI = environment.apiBaseUrl;
  private endpoint = `${this.baseAPI}categorias/`;

  constructor(private http: HttpClient) {}

  listar(
    url?: string,
    params?: { page?: number; page_size?: number; search?: string }
  ) {
    if (url) {
      return this.http.get<PagedResponse<Categoria>>(url);
    }
    let httpParams = new HttpParams();
    if (params?.page != null)      httpParams = httpParams.set('page', String(params.page));
    if (params?.page_size != null) httpParams = httpParams.set('page_size', String(params.page_size));
    if (params?.search)            httpParams = httpParams.set('search', params.search);

    return this.http.get<PagedResponse<Categoria>>(this.endpoint, { params: httpParams });
  }

  create(dto: { nombre: string; slug: string }) {
    return this.http.post<Categoria>(`${this.baseAPI}categorias/`, dto);
  }

  update(id: number, dto: { nombre: string; slug: string }) {
    return this.http.put<Categoria>(`${this.baseAPI}categorias/${id}/`, dto);
  }


}
