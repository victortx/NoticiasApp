import { Injectable } from '@angular/core';
import {environment} from '../../enviroments/environment';
import {HttpClient} from '@angular/common/http';
import {map, Observable, Subscription, switchMap, tap, throwError, timer} from 'rxjs';
import {JwtTokens, LoginRequest, LoginResponse, LoginResponseShape, UserInfo} from '../../Types/AuthTypes';
import {getExpMs, isExpired} from '../../utils/jwt-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private refreshTimerSub?: Subscription;
  baseAPI = environment.apiBaseUrl;
  ACCESS_KEY   = 'access_token';
  REFRESH_KEY  = 'refresh_token';
  USER_KEY     = 'user_info';
  ACCESS_EXP   = 'access_expires_at';
  REFRESH_EXP  = 'refresh_expires_at';
  REFRESH_MARGIN_MS = 60_000;

  constructor(private http: HttpClient) { }

  login(dto: LoginRequest): Observable<UserInfo> {
    return this.http.post<LoginResponseShape>(`${this.baseAPI}auth/login/`, dto).pipe(
      tap(res => {
        const user: UserInfo = {
          id: res.user_id,
          username: res.username,
          nombre: res.name,
          rol: res.role,
        };
        this.persistSession(res.access, res.refresh, user);
        this.startRefreshTimer(); // agenda auto-refresh
      }),
      map(res => ({
        id: res.user_id,
        username: res.username,
        nombre: res.name,
        rol: res.role,
      }))
    );
  }

  private persistSession(access: string, refresh: string, user: UserInfo) {
    localStorage.setItem(this.ACCESS_KEY, access);
    localStorage.setItem(this.REFRESH_KEY, refresh);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.ACCESS_EXP, String(getExpMs(access)));
    localStorage.setItem(this.REFRESH_EXP, String(getExpMs(refresh)));
  }

  refresh(): Observable<{ access: string }> {
    const refresh = localStorage.getItem(this.REFRESH_KEY) || '';
    if (!refresh || isExpired(refresh)) {
      return throwError(() => new Error('Refresh token expirado o ausente'));
    }
    return this.http.post<{ access: string }>(`${this.baseAPI}auth/refresh/`, { refresh }).pipe(
      tap(r => {
        localStorage.setItem(this.ACCESS_KEY, r.access);
        localStorage.setItem(this.ACCESS_EXP, String(getExpMs(r.access)));
        this.startRefreshTimer(); // reprograma el siguiente
      })
    );
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  private startRefreshTimer() {
    this.stopRefreshTimer();
    const access = this.accessToken;
    if (!access) return;

    const expMs = getExpMs(access);
    if (!expMs) return;

    const delay = Math.max(expMs - Date.now() - this.REFRESH_MARGIN_MS, 0);
    this.refreshTimerSub = timer(delay).pipe(
      switchMap(() => this.refresh())
    ).subscribe({
      error: () => this.logout() // si falla refresh, cerramos sesión
    });
  }

  get user(): UserInfo | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) as UserInfo : null;
  }

  isLoggedIn(): boolean {
    const t = this.accessToken;
    return !!t && !this.isTokenExpired(t);
  }

  logout() {
    this.stopRefreshTimer();
    [this.ACCESS_KEY, this.REFRESH_KEY, this.USER_KEY, this.ACCESS_EXP, this.REFRESH_EXP].forEach(k => localStorage.removeItem(k));
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp as number;
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }

  private stopRefreshTimer() {
    this.refreshTimerSub?.unsubscribe();
    this.refreshTimerSub = undefined;
  }

}
