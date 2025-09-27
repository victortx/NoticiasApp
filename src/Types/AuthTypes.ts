export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtTokens {
  access: string;
  refresh: string;
}

export interface UserInfo {
  id?: number;
  username: string;
  nombre: string;
  rol: string;
}

export interface LoginResponse {
  tokens: JwtTokens;
  user: UserInfo;
}

export interface LoginResponseShape {
  access: string;
  refresh: string;
  role: string;
  name: string;
  username: string;
  user_id: number;
}

export interface MenuItem {
  id: number;
  nombre: string;
  estado: 'activo' | 'inactivo';
  ruta: string;
  fecha_creacion: string;
  icono: string;
  fullPath?: string;
}


export interface PagedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
