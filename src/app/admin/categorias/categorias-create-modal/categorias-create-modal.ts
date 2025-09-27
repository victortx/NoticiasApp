import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoriasService} from '../../../services/categorias-service';
import Modal from 'bootstrap/js/dist/modal';
import {Categoria} from '../../../../Types/categoriasType';


@Component({
  selector: 'app-categorias-create-modal',
  standalone: false,
  templateUrl: './categorias-create-modal.html',
  styleUrl: './categorias-create-modal.scss'
})
export class CategoriasCreateModal {
  @Output() created = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();
  @ViewChild('modalEl', { static: true }) modalEl!: ElementRef<HTMLDivElement>;
  private modalRef?: Modal;

  loading = false;
  errorMsg = '';
  mode: 'create' | 'edit' = 'create';
  private editingId?: number;

  form: FormGroup;

  constructor(private fb: FormBuilder, private api: CategoriasService) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      slug:   ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  open() { this.openCrear(); }
  openCrear() {
    this.mode = 'create';
    this.editingId = undefined;
    this.errorMsg = '';
    this.form.reset();
    this.ensureModal().show();
  }

  openForEdit(cat: Categoria) {
    this.mode = 'edit';
    this.editingId = cat.id;
    this.errorMsg = '';
    this.form.reset({
      nombre: cat.nombre,
      slug:   cat.slug,
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

  onNombreInput() {
    if (this.mode !== 'create') return;
    const nombre = this.form.get('nombre')?.value || '';
    const slugCtrl = this.form.controls['slug'];
    if (!slugCtrl.dirty) {
      slugCtrl.setValue(this.slugify(nombre), { emitEvent: false });
    }
  }

  private slugify(v: string): string {
    return (v || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  submit() {
    this.errorMsg = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    const dto = this.form.value as { nombre: string; slug: string };

    const obs = this.mode === 'create'
      ? this.api.create(dto)
      : this.api.update(this.editingId!, dto);

    obs.subscribe({
      next: () => {
        this.loading = false;
        this.close();
        this.mode === 'create' ? this.created.emit() : this.updated.emit();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.detail || 'No se pudo guardar la categoría';
      }
    });
  }
}
