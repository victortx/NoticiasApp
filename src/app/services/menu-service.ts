import { Injectable } from '@angular/core';
import {environment} from '../../enviroments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {MenuItem, PagedResponse} from '../../Types/AuthTypes';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  baseAPI = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  obtenerMenu(): Observable<MenuItem[]> {
    return this.http.get<PagedResponse<MenuItem>>(`${this.baseAPI}menu/`).pipe(
      map(res => (res.results || [])
        .filter(i => i.estado === 'activo')
        .map(i => ({
          ...i,
          fullPath: i.ruta.startsWith('/dashboard')
            ? i.ruta
            : `/dashboard/${i.ruta.replace(/^\//, '')}`
        }))
      )
    );
  }
}
