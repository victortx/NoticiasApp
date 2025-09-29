export interface UsuarioAdmin {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  telefono?: string;
  direccion?: string;
  role: string;
  is_active: boolean;
}

export interface PagedUsers<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  telefono?: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
  first_name: string;
  last_name: string;
}
