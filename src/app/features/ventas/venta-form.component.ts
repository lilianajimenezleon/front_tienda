import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { VentaService, ProductoService, AuthService } from '../../core/services';
import { Producto, Venta } from '../../core/models/business.models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-cart-plus me-2"></i>{{ isEditMode ? (isAdmin ? 'Editar Venta' : 'Detalle de Venta') : 'Nueva Venta' }}</h2>
        <button class="btn btn-outline-secondary" routerLink="/ventas">
          <i class="bi bi-arrow-left me-2"></i>Volver
        </button>
      </div>

      <div class="card shadow-sm">
        <div class="card-body">
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            
            <!-- Método de Pago y Observaciones -->
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Método de Pago</label>
                <select formControlName="metodoPago" class="form-select" [disabled]="isEditMode && !isAdmin">
                  <option value="">Seleccione...</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
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
                <button type="button" class="btn btn-sm btn-primary" (click)="agregarProducto()" *ngIf="!isEditMode || isAdmin">
                  <i class="bi bi-plus-circle me-1"></i>Agregar Producto
                </button>
              </div>

              <div formArrayName="detalles">
                <div *ngFor="let detalle of detalles.controls; let i = index" [formGroupName]="i" class="card mb-3">
                  <div class="card-body">
                    <div class="row g-3 align-items-end">
                      <div class="col-md-5">
                        <label class="form-label">Producto</label>
                        <select formControlName="idProducto" class="form-select"
                          (change)="onProductoChange(i)"
                          [ngClass]="{ 'is-invalid': submitted && detalle.get('idProducto')?.errors }">
                          <option value="">Seleccione un producto...</option>
                          <option *ngFor="let p of productos" [value]="p.idProducto"
                            [disabled]="productoYaAgregado(p.idProducto)">
                            {{p.nombreProducto}} - Stock: {{p.stockActual}} - \${{p.precioVenta}}
                            <span *ngIf="productoYaAgregado(p.idProducto)"> (Ya agregado)</span>
                          </option>
                        </select>
                        <div *ngIf="submitted && detalle.get('idProducto')?.errors" class="invalid-feedback">
                          Seleccione un producto
                        </div>
                      </div>
                      
                      <div class="col-md-2">
                        <label class="form-label">Cantidad</label>
                        <input type="number" formControlName="cantidad" class="form-control" 
                          (input)="calcularSubtotal(i)"
                          [ngClass]="{ 'is-invalid': submitted && detalle.get('cantidad')?.errors }" />
                        <div *ngIf="submitted && detalle.get('cantidad')?.errors" class="invalid-feedback">
                          <div *ngIf="detalle.get('cantidad')?.errors?.['required']">Requerido</div>
                          <div *ngIf="detalle.get('cantidad')?.errors?.['min']">Mínimo 1</div>
                        </div>
                      </div>
                      
                      <div class="col-md-2">
                        <label class="form-label">Precio Unit.</label>
                        <input type="number" formControlName="precioUnitario" class="form-control" readonly />
                      </div>
                      
                      <div class="col-md-2">
                        <label class="form-label">Subtotal</label>
                        <input type="number" formControlName="subtotal" class="form-control" readonly />
                      </div>
                      
                      <div class="col-md-1">
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
                    <h4 class="mb-0">Total: <span class="float-end">\${{total | number:'1.2-2'}}</span></h4>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="mt-4 d-flex justify-content-end gap-2">
              <button type="button" routerLink="/ventas" class="btn btn-secondary">Cancelar</button>
              <button type="submit" [disabled]="loading || detalles.length === 0" class="btn btn-success" *ngIf="!isEditMode">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                <i *ngIf="!loading" class="bi bi-check-circle me-1"></i>
                Registrar Venta
              </button>
              <button type="button" (click)="onUpdate()" [disabled]="loading" class="btn btn-primary" *ngIf="isEditMode && isAdmin">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                <i *ngIf="!loading" class="bi bi-pencil me-1"></i>
                Actualizar Venta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class VentaFormComponent implements OnInit {
  form!: FormGroup;
  productos: Producto[] = [];
  loading = false;
  submitted = false;
  total = 0;
  isEditMode = false;
  isAdmin = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ventaService: VentaService,
    private productoService: ProductoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
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
      metodoPago: [''],
      observaciones: [''],
      detalles: this.formBuilder.array([])
    });

    // Check if we're in edit mode (viewing details)
    const idVenta = this.route.snapshot.paramMap.get('id');
    if (idVenta) {
      this.isEditMode = true;
      this.isAdmin = this.authService.isAdmin();
      this.loadVentaDetails(idVenta);
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
      precioUnitario: [0],
      subtotal: [0]
    });

    this.detalles.push(detalleGroup);
  }

  // Método auxiliar para verificar si un producto ya está en los detalles
  productoYaAgregado(idProducto: string): boolean {
    return this.detalles.controls.some(detalle =>
      detalle.get('idProducto')?.value === idProducto
    );
  }

  eliminarProducto(index: number) {
    const idProductoARemover = this.detalles.at(index)?.get('idProducto')?.value;
    this.detalles.removeAt(index);
    this.calcularTotal();
    if (idProductoARemover) {
      // Opcional: limpiar si usas un Set, pero aquí solo detectChanges
    }
    this.cdr.detectChanges();
  }

  onProductoChange(index: number) {
    const detalle = this.detalles.at(index);
    const idProducto = detalle.get('idProducto')?.value;
    const producto = this.productos.find(p => p.idProducto === idProducto);

    if (producto) {
      detalle.patchValue({
        precioUnitario: producto.precioVenta
      });
      this.calcularSubtotal(index);
      this.cdr.detectChanges();
    }
  }

  calcularSubtotal(index: number) {
    const detalle = this.detalles.at(index);
    const cantidad = detalle.get('cantidad')?.value || 0;
    const precioUnitario = detalle.get('precioUnitario')?.value || 0;
    const subtotal = cantidad * precioUnitario;

    detalle.patchValue({ subtotal }, { emitEvent: false });
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.detalles.controls.reduce((sum, detalle) => {
      return sum + (detalle.get('subtotal')?.value || 0);
    }, 0);
  }

  loadVentaDetails(idVenta: string) {
    this.loading = true;
    this.ventaService.getById(idVenta).subscribe({
      next: (venta: Venta) => {
        this.form.patchValue({
          metodoPago: venta.metodoPago,
          observaciones: venta.observaciones
        });

        // Clear existing details and add from the venta
        while (this.detalles.length !== 0) {
          this.detalles.removeAt(0);
        }

        venta.detalles?.forEach(detalle => {
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
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar detalles de venta', error);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid || this.detalles.length === 0) {
      return;
    }

    // Validar que no haya productos duplicados
    const productosSeleccionados = this.detalles.controls.map(d => d.get('idProducto')?.value).filter(id => id);
    const productosUnicos = new Set(productosSeleccionados);
    if (productosSeleccionados.length !== productosUnicos.size) {
      alert('No se permiten productos duplicados en la venta.');
      return;
    }

    this.loading = true;
    this.ventaService.create(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['/ventas']);
        },
        error: error => {
          console.error('Error al crear venta', error);
          this.loading = false;
        }
      });
  }

  onUpdate() {
    this.submitted = true;

    if (this.form.invalid || this.detalles.length === 0) {
      return;
    }

    this.loading = true;
    const idVenta = this.route.snapshot.paramMap.get('id');
    if (idVenta) {
      this.ventaService.update(idVenta, this.form.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['/ventas']);
          },
          error: error => {
            console.error('Error al actualizar venta', error);
            this.loading = false;
          }
        });
    }
  }
}
