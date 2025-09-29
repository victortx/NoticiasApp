import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../enviroments/environment';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  forgot(email: string) {
    return this.http.post<{detail: string}>(`${this.base}auth/password/forgot/`, { email });
  }

  reset(payload: { uid: string; token: string; password: string }) {
    return this.http.post(`${this.base}auth/password/reset/`, payload);
  }

  change(payload: { current_password: string; new_password: string }) {
    return this.http.post(`${this.base}auth/password/change/`, payload);
  }
}
