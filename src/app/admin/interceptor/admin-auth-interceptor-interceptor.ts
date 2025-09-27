// src/app/admin/interceptors/admin-auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth-service';

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adjunta Authorization solo si hay token
    const token = this.auth.accessToken;
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        // Manejo mínimo de 401: cerrar sesión y llevar a login
        if (err.status === 401) {
          this.auth.logout();
          this.router.navigateByUrl('/auth/login');
        }
        return throwError(() => err);
      })
    );
  }
}
