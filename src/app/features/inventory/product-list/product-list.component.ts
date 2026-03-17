import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../../core/services';
import { Producto } from '../../../core/models/business.models';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Inventario de Productos</h2>
      <button class="btn btn-primary" routerLink="/productos/nuevo">
        <i class="bi bi-plus-lg me-2"></i>Nuevo Producto
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th class="text-end">Precio Venta</th>
                <th class="text-center">Stock</th>
                <th class="text-center">Estado</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let producto of productos">
                <td><span class="badge bg-light text-dark border">{{producto.codigoProducto || 'N/A'}}</span></td>
                <td>
                  <div class="fw-bold">{{producto.nombreProducto}}</div>
                  <small class="text-muted">{{producto.unidadMedida}}</small>
                </td>
                <td>{{producto.nombreCategoria || 'Sin Categoría'}}</td>
                <td class="text-end">{{producto.precioVenta | currency}}</td>
                <td class="text-center">
                  <span class="badge" [ngClass]="{
                    'bg-success': producto.stockActual > producto.stockMinimo,
                    'bg-warning text-dark': producto.stockActual <= producto.stockMinimo && producto.stockActual > 0,
                    'bg-danger': producto.stockActual === 0
                  }">
                    {{producto.stockActual}}
                  </span>
                </td>
                <td class="text-end">
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary" [routerLink]="['/productos/editar', producto.idProducto]">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="deleteProduct(producto.idProducto)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="productos.length === 0 && !loading">
                <td colspan="7" class="text-center py-5 text-muted">
                  <i class="bi bi-box-seam fs-1 d-block mb-2"></i>
                  No hay productos registrados
                </td>
              </tr>
              <tr *ngIf="loading">
                <td colspan="7" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  productos: Producto[] = [];
  loading = false;

  constructor(
    private productoService: ProductoService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    // TODO: Obtener ID de tienda del usuario o selección
    // Por ahora simulamos un ID de tienda o usamos uno fijo para pruebas si no hay usuario con tienda asignada
    // En un escenario real, el usuario tendría una tienda asociada en su perfil o seleccionaría una.
    const idTienda = '00000000-0000-0000-0000-000000000000'; // Placeholder

    // Si tuviéramos el ID de la tienda en el usuario:
    // const user = this.authService.currentUserValue;
    // if (user) ...

    // Para evitar errores 404 en desarrollo sin datos, manejaremos el error silenciosamente o mostraremos lista vacía
    this.loading = false;
  }

  deleteProduct(id: string) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productoService.delete(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
