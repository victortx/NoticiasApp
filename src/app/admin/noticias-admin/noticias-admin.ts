import {Component, OnInit, ViewChild} from '@angular/core';
import {NoticiaAdmin, PagedResp} from '../../../Types/NoticiasAdminTypes';
import {NoticiasAdminService} from '../../services/noticias-admin-service';
import {AuthService} from '../../services/auth-service';
import {NoticiasEditModalComponent} from './noticias-edit-modal.component/noticias-edit-modal.component';

@Component({
  selector: 'app-noticias-admin',
  standalone: false,
  templateUrl: './noticias-admin.html',
  styleUrl: './noticias-admin.scss'
})
export class NoticiasAdmin implements OnInit {
  @ViewChild('editModal', { static: false }) editModal!: NoticiasEditModalComponent;
  data?: PagedResp<NoticiaAdmin>;
  loading = false;
  error = '';

  private authorIdFilter?: number;
  isAdmin = false;

  constructor(
    private api: NoticiasAdminService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.auth.user;
    this.isAdmin = (user?.rol || '').toLowerCase() === 'admin';
    this.authorIdFilter = this.isAdmin ? undefined : user?.id;
    this.fetch();
  }

  fetch(url?: string) {
    this.loading = true;
    this.error = '';

    const opts = url
      ? { url }
      : { authorId: this.authorIdFilter };

    this.api.listar(opts).subscribe({
      next: res => this.data = res,
      error: () => this.error = 'Error cargando noticias.',
      complete: () => this.loading = false
    });
  }

  openCreate() { this.editModal.openCreate(); }

  next() { if (this.data?.next) this.fetch(this.data.next); }
  prev() { if (this.data?.previous) this.fetch(this.data.previous); }

  trackById(_: number, n: NoticiaAdmin) { return n.id; }

  openEdit(n: NoticiaAdmin) { this.editModal.openEdit(n); }
  reload() { this.fetch(); }

}
