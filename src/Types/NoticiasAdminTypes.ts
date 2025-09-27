export interface CategoriaLite {
  id: number;
  nombre: string;
  slug: string;
}


export interface PagedResp<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}


export interface CategoriaLite {
  id: number;
  nombre: string;
  slug: string;
}

export interface NoticiaAdmin {
  id: number;
  slug: string;
  miniatura: string | null;
  titulo: string;
  descripcion: string;
  cuerpo: string;
  autor: number;
  autor_nombre: string;
  categoria: CategoriaLite;
  fecha_publicacion: string | null;
  fecha_creacion: string;
  hoja_estilo?: string | null;
}

export interface PagedResp<T> {
  count: number; next: string | null; previous: string | null; results: T[];
}

export interface NoticiaAdminPayload {
  titulo: string;
  descripcion?: string;
  cuerpo: string;
  categoria: number;                // id
  fecha_publicacion?: string | null;
  hoja_estilo?: string;
  miniatura?: File | null;
}
