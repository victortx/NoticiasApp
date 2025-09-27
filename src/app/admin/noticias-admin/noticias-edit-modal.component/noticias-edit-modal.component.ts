import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import Modal from 'bootstrap/js/dist/modal';
import {CategoriaSelect} from '../../../../Types/categoriasType';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NoticiasAdminService} from '../../../services/noticias-admin-service';
import {CategoriasService} from '../../../services/categorias-service';
import {NoticiaAdmin} from '../../../../Types/NoticiasAdminTypes';

@Component({
  selector: 'app-noticias-edit-modal',
  standalone: false,
  templateUrl: './noticias-edit-modal.component.html',
  styleUrl: './noticias-edit-modal.component.scss'
})
export class NoticiasEditModalComponent implements OnInit {
  @Output() created = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();
  @ViewChild('modalEl', { static: true }) modalEl!: ElementRef<HTMLDivElement>;
  private modalRef?: Modal;

  mode: 'create' | 'edit' = 'create';
  private editingId?: number;

  loading = false;
  errorMsg = '';
  imagePreview?: string;          // preview de miniatura
  imageFile?: File | null;        // archivo seleccionado
  categorias: CategoriaSelect[] = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private noticiasApi: NoticiasAdminService,
    private categoriasApi: CategoriasService
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      cuerpo: ['', [Validators.required, Validators.minLength(10)]],
      categoria: [null, [Validators.required]],
      fecha_publicacion: [null],
      hoja_estilo: [''],
    });
  }

  ngOnInit(): void {
    // carga categorías para el select (ajusta si tienes paginación; aquí pido primeras 100)
    this.categoriasApi.listar(`${this.categoriasApi['endpoint']}?page_size=100`).subscribe({
      next: res => this.categorias = (res.results || []).map(r => ({ id: r.id, nombre: r.nombre })),
      error: () => this.categorias = []
    });
  }

  openCreate() {
    this.mode = 'create';
    this.editingId = undefined;
    this.errorMsg = '';
    this.imageFile = null;
    this.imagePreview = undefined;
    this.form.reset({
      titulo: '',
      descripcion: '',
      cuerpo: '',
      categoria: null,
      fecha_publicacion: null,
      hoja_estilo: ''
    });
    this.ensureModal().show();
  }

  openEdit(n: NoticiaAdmin) {
    this.mode = 'edit';
    this.editingId = n.id;
    this.errorMsg = '';
    this.imageFile = null;
    this.imagePreview = n.miniatura || undefined;

    this.form.reset({
      titulo: n.titulo,
      descripcion: n.descripcion || '',
      cuerpo: n.cuerpo,
      categoria: typeof n.categoria === 'number' ? n.categoria : n.categoria?.id,
      fecha_publicacion: n.fecha_publicacion ? this.isoToLocalDT(n.fecha_publicacion) : null,
      hoja_estilo: n.hoja_estilo || ''
    });
    this.ensureModal().show();
  }

  close() { this.modalRef?.hide(); }

  private ensureModal(): Modal {
    this.modalRef = this.modalRef ?? new Modal(this.modalEl.nativeElement, {
      backdrop: 'static', keyboard: false
    });
    return this.modalRef!;
  }

  /** input file */
  onMiniaturaChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.imageFile = file;
    if (file) {
      // preview
      const url = URL.createObjectURL(file);
      this.imagePreview = url;
    } else {
      this.imagePreview = undefined;
    }
  }

  /** Convertir ISO -> 'yyyy-MM-ddTHH:mm' para input datetime-local */
  private isoToLocalDT(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  /** Convertir 'yyyy-MM-ddTHH:mm' local -> ISO */
  private localDTToIso(local: string | null): string | null {
    if (!local) return null;
    // crea fecha local y conviértela a ISO; según tu backend puede esperar TZ específica
    const d = new Date(local);
    return d.toISOString();
  }

  submit() {
    this.errorMsg = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    const v = this.form.value;
    const payload = {
      titulo: v.titulo as string,
      descripcion: (v.descripcion || '') as string,
      cuerpo: v.cuerpo as string,
      categoria: Number(v.categoria),
      fecha_publicacion: this.localDTToIso(v.fecha_publicacion || null),
      hoja_estilo: (v.hoja_estilo || '') as string,
      miniatura: this.imageFile || undefined,
    };

    const req$ = this.mode === 'create'
      ? this.noticiasApi.create(payload)
      : this.noticiasApi.update(this.editingId!, payload);

    req$?.subscribe({
      next: () => {
        this.loading = false;
        this.close();
        (this.mode === 'create' ? this.created : this.updated).emit();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.detail || 'No se pudo guardar la noticia';
      }
    });
  }


}
