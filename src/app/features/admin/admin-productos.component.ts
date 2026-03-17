import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface Producto {
  idProducto: string;
  idTienda: string;
  nombreProducto: string;
  codigoProducto?: string;
  precioVenta: number;
  precioCompra?: number;
  stockActual: number;
  stockMinimo: number;
  nombreCategoria?: string;
  estado: number;
}

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-box me-2"></i>Gestión Global de Productos</h2>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Buscar por nombre o código..."
                [(ngModel)]="filtroTexto"
                (input)="filtrar()">
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filtroEstado" (change)="filtrar()">
                <option value="">Todos los estados</option>
                <option [value]="0">Activos</option>
                <option [value]="1">Inactivos</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filtroStock" (change)="filtrar()">
                <option value="">Todo el stock</option>
                <option value="bajo">Stock bajo</option>
                <option value="agotado">Agotado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Productos -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Código</th>
                  <th>Categoría</th>
                  <th>Precio Venta</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let producto of productosFiltrados">
                  <td>
                    <strong>{{ producto.nombreProducto }}</strong>
                  </td>
                  <td>{{ producto.codigoProducto || 'N/A' }}</td>
                  <td>{{ producto.nombreCategoria || 'Sin categoría' }}</td>
                  <td>{{ producto.precioVenta | currency }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': producto.stockActual > producto.stockMinimo,
                      'bg-warning text-dark': producto.stockActual <= producto.stockMinimo && producto.stockActual > 0,
                      'bg-danger': producto.stockActual === 0
                    }">
                      {{ producto.stockActual }} / {{ producto.stockMinimo }}
                    </span>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': producto.estado === 0,
                      'bg-danger': producto.estado === 1
                    }">
                      {{ getEstadoName(producto.estado) }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-info" (click)="verDetalle(producto)">
                      <i class="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="productosFiltrados.length === 0">
                  <td colspan="7" class="text-center text-muted py-4">
                    No se encontraron productos
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="row mt-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <h6>Total Productos</h6>
              <h3>{{ productos.length }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-dark">
            <div class="card-body">
              <h6>Stock Bajo</h6>
              <h3>{{ contarStockBajo() }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-danger text-white">
            <div class="card-body">
              <h6>Agotados</h6>
              <h3>{{ contarAgotados() }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <h6>Activos</h6>
              <h3>{{ contarPorEstado(0) }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminProductosComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  filtroTexto = '';
  filtroEstado: string | number = '';
  filtroStock = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/productos`).subscribe({
      next: (data) => {
        this.productos = data.map(p => ({
          ...p,
          estado: Number(p.estado)
        }));
        this.productosFiltrados = this.productos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando productos', error);
        this.loading = false;
      }
    });
  }

  filtrar() {
    this.productosFiltrados = this.productos.filter(p => {
      const matchTexto = !this.filtroTexto ||
        p.nombreProducto.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        (p.codigoProducto && p.codigoProducto.toLowerCase().includes(this.filtroTexto.toLowerCase()));

      const matchEstado = this.filtroEstado === '' || p.estado === Number(this.filtroEstado);

      let matchStock = true;
      if (this.filtroStock === 'bajo') {
        matchStock = p.stockActual <= p.stockMinimo && p.stockActual > 0;
      } else if (this.filtroStock === 'agotado') {
        matchStock = p.stockActual === 0;
      }

      return matchTexto && matchEstado && matchStock;
    });
  }

  getEstadoName(estado: number): string {
    return estado === 0 ? 'ACTIVO' : 'INACTIVO';
  }

  contarPorEstado(estado: number): number {
    return this.productos.filter(p => p.estado === estado).length;
  }

  contarStockBajo(): number {
    return this.productos.filter(p => p.stockActual <= p.stockMinimo && p.stockActual > 0).length;
  }

  contarAgotados(): number {
    return this.productos.filter(p => p.stockActual === 0).length;
  }

  verDetalle(producto: Producto) {
    alert(`Detalle de ${producto.nombreProducto}\nStock: ${producto.stockActual}\nPrecio: $${producto.precioVenta}`);
  }
}
