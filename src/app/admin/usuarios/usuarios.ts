import {Component, OnInit} from '@angular/core';
import {PagedUsers, UsuarioAdmin} from '../../../Types/UsuariosTypes';
import {UsuariosAdminService} from '../../services/usuarios-admin-service';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class Usuarios implements OnInit {
  saving: Record<number, boolean> = {};
  rowError: Record<number, string> = {};
  data?: PagedUsers<UsuarioAdmin>;
  loading = false;
  error = '';

  search = '';
  roleFilter = '';
  activeFilter: '' | 'true' | 'false' = '';

  constructor(private api: UsuariosAdminService) {}


  ngOnInit(): void {
    this.fetch();
  }

  fetch(url?: string) {
    this.loading = true;
    this.error = '';
    const opts = url
      ? { url }
      : {
        page_size: 20,
        search: this.search.trim() || undefined,
        role: this.roleFilter || undefined,
        active: this.activeFilter === '' ? undefined : this.activeFilter === 'true'
      };

    this.api.listar(opts).subscribe({
      next: res => this.data = res,
      error: () => this.error = 'Error cargando usuarios.',
      complete: () => this.loading = false
    });
  }

  onSearchEnter(e: KeyboardEvent) { if (e.key === 'Enter') this.fetch(); }
  clearFilters() { this.search = ''; this.roleFilter = ''; this.activeFilter = ''; this.fetch(); }

  next() { if (this.data?.next) this.fetch(this.data.next); }
  prev() { if (this.data?.previous) this.fetch(this.data.previous); }

  trackById(_: number, u: UsuarioAdmin) { return u.id; }

  nombreCompleto(u: UsuarioAdmin) {
    const fn = u.first_name?.trim() || '';
    const ln = u.last_name?.trim() || '';
    return (fn || ln) ? `${fn} ${ln}`.trim() : '—';
  }

  roleBadge(role: string) {
    const r = (role || '').toLowerCase();
    if (r === 'admin') return 'text-bg-primary';
    if (r === 'autor' || r === 'author') return 'text-bg-secondary';
    return 'text-bg-light';
  }

  onToggleActive(u: UsuarioAdmin, event: Event) {
    const input = event.target as HTMLInputElement;
    const nuevo = input.checked;
    const anterior = u.is_active;

    if (!nuevo) {
      const ok = confirm(`¿Desactivar al usuario "${u.username}"?`);
      if (!ok) { input.checked = anterior; return; }
    }

    this.saving[u.id] = true;
    this.rowError[u.id] = '';
    u.is_active = nuevo;

    this.api.actualizarEstado(u.id, nuevo).subscribe({
      next: (res) => {
        if (typeof res?.is_active === 'boolean') u.is_active = res.is_active;
      },
      error: () => {
        // revertir en error
        u.is_active = anterior;
        input.checked = anterior;
        this.rowError[u.id] = 'No se pudo actualizar el estado.';
      },
      complete: () => {
        delete this.saving[u.id];
      }
    });
  }

}
