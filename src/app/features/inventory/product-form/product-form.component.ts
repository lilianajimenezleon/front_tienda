import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductoService } from '../../../core/services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ isAddMode ? 'Nuevo Producto' : 'Editar Producto' }}</h2>
      <button class="btn btn-outline-secondary" routerLink="/productos">
        <i class="bi bi-arrow-left me-2"></i>Volver
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="row g-3">
            <!-- Nombre -->
            <div class="col-md-12">
              <label class="form-label">Nombre del Producto</label>
              <input type="text" formControlName="nombreProducto" class="form-control" 
                [ngClass]="{ 'is-invalid': submitted && f['nombreProducto'].errors }" />
              <div *ngIf="submitted && f['nombreProducto'].errors" class="invalid-feedback">
                <div *ngIf="f['nombreProducto'].errors['required']">El nombre es requerido</div>
              </div>
            </div>

            <!-- Descripción -->
            <div class="col-12">
              <label class="form-label">Descripción</label>
              <textarea formControlName="descripcion" class="form-control" rows="3"></textarea>
            </div>

            <!-- Precios -->
            <div class="col-md-4">
              <label class="form-label">Precio Venta</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input type="number" formControlName="precioVenta" class="form-control" 
                  [ngClass]="{ 'is-invalid': submitted && f['precioVenta'].errors }" />
              </div>
              <div *ngIf="submitted && f['precioVenta'].errors" class="invalid-feedback d-block">
                <div *ngIf="f['precioVenta'].errors['required']">El precio es requerido</div>
                <div *ngIf="f['precioVenta'].errors['min']">El precio debe ser mayor a 0</div>
              </div>
            </div>

            <div class="col-md-4">
              <label class="form-label">Precio Compra</label>
              <div class="input-group">
                <span class="input-group-text">$</span>
                <input type="number" formControlName="precioCompra" class="form-control" />
              </div>
            </div>

            <!-- Stock -->
            <div class="col-md-4">
              <label class="form-label">Unidad de Medida</label>
              <select formControlName="unidadMedida" class="form-select" [ngClass]="{ 'is-invalid': submitted && f['unidadMedida'].errors }">
                <option value="">Seleccione...</option>
                <option value="Unidad">Unidad</option>
                <option value="Kg">Kilogramo</option>
                <option value="Lt">Litro</option>
                <option value="Mts">Metros</option>
              </select>
              <div *ngIf="submitted && f['unidadMedida'].errors" class="invalid-feedback">
                <div *ngIf="f['unidadMedida'].errors['required']">Requerido</div>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Stock Actual</label>
              <input type="number" formControlName="stockActual" class="form-control" 
                [ngClass]="{ 'is-invalid': submitted && f['stockActual'].errors }" />
              <div *ngIf="submitted && f['stockActual'].errors" class="invalid-feedback">
                <div *ngIf="f['stockActual'].errors['required']">Requerido</div>
                <div *ngIf="f['stockActual'].errors['min']">No puede ser negativo</div>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Stock Mínimo</label>
              <input type="number" formControlName="stockMinimo" class="form-control" 
                [ngClass]="{ 'is-invalid': submitted && f['stockMinimo'].errors }" />
              <div *ngIf="submitted && f['stockMinimo'].errors" class="invalid-feedback">
                <div *ngIf="f['stockMinimo'].errors['required']">Requerido</div>
                <div *ngIf="f['stockMinimo'].errors['min']">No puede ser negativo</div>
              </div>
            </div>
          </div>

          <div class="mt-4 d-flex justify-content-end gap-2">
            <button type="button" routerLink="/productos" class="btn btn-secondary">Cancelar</button>
            <button type="submit" [disabled]="loading" class="btn btn-primary">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  id!: string;
  isAddMode!: boolean;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const idTienda = user.tiendas?.[0]?.idTienda || null;

    this.form = this.formBuilder.group({
      idTienda: [idTienda],
      nombreProducto: ['', Validators.required],
      codigoProducto: [''],
      descripcion: [''],
      precioVenta: [0, [Validators.required, Validators.min(0.01)]],
      precioCompra: [0],
      stockActual: [0, [Validators.required, Validators.min(0)]],
      stockMinimo: [5, [Validators.required, Validators.min(0)]],
      unidadMedida: ['', Validators.required],
      idCategoria: [null]
    });

    if (!this.isAddMode) {
      this.productoService.getById(this.id)
        .pipe(first())
        .subscribe(x => this.form.patchValue(x));
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser() {
    this.productoService.create(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: error => {
          this.loading = false;
        }
      });
  }

  private updateUser() {
    this.productoService.update(this.id, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: error => {
          this.loading = false;
        }
      });
  }
}
