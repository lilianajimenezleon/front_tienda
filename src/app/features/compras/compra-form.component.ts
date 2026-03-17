import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CompraService, ProductoService, AuthService } from '../../core/services';
import { Producto, Compra } from '../../core/models/business.models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-compra-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-cart-check me-2"></i>{{ isEditMode ? 'Detalle de Compra' : 'Nueva Compra' }}</h2>
        <button class="btn btn-outline-secondary" routerLink="/compras">
          <i class="bi bi-arrow-left me-2"></i>Volver
        </button>
      </div>

      <div class="card shadow-sm">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">

            <!-- Número de Factura y Observaciones -->
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Número de Factura</label>
                <input type="text" formControlName="numeroFactura" class="form-control"
                  placeholder="Ej: FAC-001" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Observaciones</label>
                <input type="text" formControlName="observaciones" class="form-control" />
              </div>
            </div>

            <!-- Productos -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>Productos</h5>
                <button type="button" class="btn btn-sm btn-primary" (click)="agregarProducto()" *ngIf="!isEditMode">
                  <i class="bi bi-plus-circle me-1"></i>Agregar Producto
                </button>
              </div>

              <div formArrayName="detalles">
                <div *ngFor="let detalle of detalles.controls; let i = index" [formGroupName]="i" class="card mb-3">
                  <div class="card-body">
                    <div class="row g-3 align-items-end">
                      <div class="col-md-4" *ngIf="!isEditMode">
                        <label class="form-label">Producto</label>
                        <select formControlName="idProducto" class="form-select"
                          (change)="onProductoChange(i)"
                          [ngClass]="{ 'is-invalid': submitted && detalle.get('idProducto')?.errors }">
                          <option value="">Seleccione un producto...</option>
                          <option *ngFor="let p of productos" [value]="p.idProducto">
                            {{p.nombreProducto}} - Stock actual: {{p.stockActual}} - \${{p.precioCompra}}
                          </option>
                        </select>
                        <div *ngIf="submitted && detalle.get('idProducto')?.errors" class="invalid-feedback">
                          Seleccione un producto
                        </div>
                      </div>
                      <div class="col-md-4" *ngIf="isEditMode">
                        <label class="form-label">Producto</label>
                        <div class="form-control-plaintext">{{ getProductoNombre(detalle.get('idProducto')?.value) }}</div>
                      </div>

                      <div class="col-md-2">
                        <label class="form-label">Cantidad</label>
                        <input *ngIf="!isEditMode" type="number" formControlName="cantidad" class="form-control"
                          (input)="calcularSubtotal(i)"
                          [ngClass]="{ 'is-invalid': submitted && detalle.get('cantidad')?.errors }" />
                        <div *ngIf="isEditMode" class="form-control-plaintext">{{ detalle.get('cantidad')?.value }}</div>
                        <div *ngIf="!isEditMode && submitted && detalle.get('cantidad')?.errors" class="invalid-feedback">
                          <div *ngIf="detalle.get('cantidad')?.errors?.['required']">Requerido</div>
                          <div *ngIf="detalle.get('cantidad')?.errors?.['min']">Mínimo 1</div>
                        </div>
                      </div>

                      <div class="col-md-2">
                        <label class="form-label">Precio Compra</label>
                        <div *ngIf="!isEditMode" class="input-group">
                          <span class="input-group-text">$</span>
                          <input type="number" formControlName="precioUnitario" class="form-control"
                            (input)="calcularSubtotal(i)"
                            [ngClass]="{ 'is-invalid': submitted && detalle.get('precioUnitario')?.errors }" />
                        </div>
                        <div *ngIf="isEditMode" class="form-control-plaintext">$ {{ detalle.get('precioUnitario')?.value }}</div>
                        <div *ngIf="!isEditMode && submitted && detalle.get('precioUnitario')?.errors" class="invalid-feedback d-block">
                          <div *ngIf="detalle.get('precioUnitario')?.errors?.['required']">Requerido</div>
                          <div *ngIf="detalle.get('precioUnitario')?.errors?.['min']">Debe ser mayor a 0</div>
                        </div>
                      </div>

                      <div class="col-md-3">
                        <label class="form-label">Subtotal</label>
                        <div *ngIf="!isEditMode" class="input-group">
                          <span class="input-group-text">$</span>
                          <input type="number" formControlName="subtotal" class="form-control" readonly />
                        </div>
                        <div *ngIf="isEditMode" class="form-control-plaintext">$ {{ detalle.get('subtotal')?.value }}</div>
                      </div>

                      <div class="col-md-1" *ngIf="!isEditMode">
                        <button type="button" class="btn btn-danger btn-sm w-100" (click)="eliminarProducto(i)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="detalles.length === 0" class="alert alert-info">
                No hay productos agregados. Haga clic en "Agregar Producto" para comenzar.
              </div>
            </div>

            <!-- Total -->
            <div class="row">
              <div class="col-md-8"></div>
              <div class="col-md-4">
                <div class="card bg-light">
                  <div class="card-body">
                    <h4 class="mb-0">Total: <span class="float-end">$ {{ total | number:'1.2-2' }}</span></h4>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="mt-4 d-flex justify-content-end gap-2">
              <button type="button" routerLink="/compras" class="btn btn-secondary">Cancelar</button>
              <button type="submit" [disabled]="loading || detalles.length === 0 || isEditMode" class="btn btn-success">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                <i *ngIf="!loading" class="bi bi-check-circle me-1"></i>
                {{ isEditMode ? 'Ver Detalle' : 'Registrar Compra' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CompraFormComponent implements OnInit {
  form!: FormGroup;
  productos: Producto[] = [];
  loading = false;
  submitted = false;
  total = 0;
  isEditMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private compraService: CompraService,
    private productoService: ProductoService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let idTienda = user.tiendas?.[0]?.idTienda || '';

    // Si no está en el usuario, intentar obtenerlo del token
    if (!idTienda) {
      idTienda = this.authService.getTiendaIdFromToken() || '';
      console.log('IdTienda obtenido del token:', idTienda);
    }

    this.form = this.formBuilder.group({
      idTienda: [idTienda],
      idProveedor: [null],
      numeroFactura: [''],
      observaciones: [''],
      detalles: this.formBuilder.array([])
    });

    // Check if we're in edit mode (viewing details)
    const idCompra = this.route.snapshot.paramMap.get('id');
    if (idCompra) {
      this.isEditMode = true;
      this.loadCompraDetails(idCompra);
    }

    if (idTienda) {
      this.cargarProductos(idTienda);
    } else {
      console.warn('No se encontró idTienda en el usuario local ni en el token');
    }
  }

  get detalles() {
    return this.form.get('detalles') as FormArray;
  }

  cargarProductos(idTienda: string) {
    console.log('Cargando productos para tienda:', idTienda);
    this.productoService.getByTienda(idTienda).subscribe({
      next: (data) => {
        console.log('Datos crudos recibidos:', data);
        this.productos = data; // Mostrar todos para depurar
        console.log('Productos asignados:', this.productos);
      },
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  agregarProducto() {
    const detalleGroup = this.formBuilder.group({
      idProducto: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0.01)]],
      subtotal: [0]
    });

    this.detalles.push(detalleGroup);
  }

  eliminarProducto(index: number) {
    this.detalles.removeAt(index);
    this.calcularTotal();
  }

  calcularSubtotal(index: number) {
    const detalle = this.detalles.at(index);
    const cantidad = detalle.get('cantidad')?.value || 0;
    const precioUnitario = detalle.get('precioUnitario')?.value || 0;
    const subtotal = cantidad * precioUnitario;

    detalle.patchValue({ subtotal }, { emitEvent: false });
    this.calcularTotal();
  }

  onProductoChange(index: number) {
    const detalle = this.detalles.at(index);
    const idProducto = detalle.get('idProducto')?.value;
    const producto = this.productos.find(p => p.idProducto === idProducto);

    if (producto) {
      detalle.patchValue({
        precioUnitario: producto.precioCompra
      });
      this.calcularSubtotal(index);
    }
  }

  calcularTotal() {
    this.total = this.detalles.controls.reduce((sum, detalle) => {
      return sum + (detalle.get('subtotal')?.value || 0);
    }, 0);
  }

  getProductoNombre(idProducto: string): string {
    const producto = this.productos.find(p => p.idProducto === idProducto);
    return producto ? producto.nombreProducto : 'Producto no encontrado';
  }

  loadCompraDetails(idCompra: string) {
    this.loading = true;
    this.compraService.getById(idCompra).subscribe({
      next: (compra: Compra) => {
        this.form.patchValue({
          numeroFactura: compra.numeroFactura,
          observaciones: compra.observaciones
        });

        // Clear existing details and add from the compra
        while (this.detalles.length !== 0) {
          this.detalles.removeAt(0);
        }

        compra.detalles?.forEach(detalle => {
          const detalleGroup = this.formBuilder.group({
            idProducto: [detalle.idProducto, Validators.required],
            cantidad: [detalle.cantidad, [Validators.required, Validators.min(1)]],
            precioUnitario: [detalle.precioUnitario, [Validators.required, Validators.min(0.01)]],
            subtotal: [detalle.subtotal]
          });
          this.detalles.push(detalleGroup);
        });

        this.calcularTotal();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar detalles de compra', error);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid || this.detalles.length === 0) {
      return;
    }

    this.loading = true;
    this.compraService.create(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['/compras']);
        },
        error: error => {
          console.error('Error al crear compra', error);
          this.loading = false;
        }
      });
  }
}
