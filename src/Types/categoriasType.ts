export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

export interface PagedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CategoriaSelect { id: number; nombre: string; }
