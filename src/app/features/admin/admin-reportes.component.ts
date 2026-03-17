import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface EstadisticasGlobales {
  totalTiendas: number;
  tiendasActivas: number;
  totalProductos: number;
  productosStockBajo: number;
  totalUsuarios: number;
  usuariosActivos: number;
  ventasHoy: number;
  ventasMes: number;
}

@Component({
  selector: 'app-admin-reportes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-graph-up me-2"></i>Reportes y Estadísticas Globales</h2>
      </div>

      <!-- Estadísticas Principales -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-0">Total Tiendas</h6>
                  <h2 class="mb-0">{{ stats.totalTiendas }}</h2>
                  <small>{{ stats.tiendasActivas }} activas</small>
                </div>
                <i class="bi bi-shop fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-0">Total Productos</h6>
                  <h2 class="mb-0">{{ stats.totalProductos }}</h2>
                  <small>{{ stats.productosStockBajo }} stock bajo</small>
                </div>
                <i class="bi bi-box fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-0">Total Usuarios</h6>
                  <h2 class="mb-0">{{ stats.totalUsuarios }}</h2>
                  <small>{{ stats.usuariosActivos }} activos</small>
                </div>
                <i class="bi bi-people fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card bg-warning text-dark">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-0">Ventas Hoy</h6>
                  <h2 class="mb-0">{{ stats.ventasHoy | currency }}</h2>
                  <small>Mes: {{ stats.ventasMes | currency }}</small>
                </div>
                <i class="bi bi-cash-stack fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen por Tienda -->
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">Resumen por Tienda</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Tienda</th>
                  <th>Dueño</th>
                  <th>Productos</th>
                  <th>Ventas Mes</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let tienda of tiendas">
                  <td><strong>{{ tienda.nombreTienda }}</strong></td>
                  <td>{{ tienda.nombreDueno }}</td>
                  <td>
                    <span class="badge bg-info">{{ tienda.totalProductos || 0 }}</span>
                  </td>
                  <td>{{ (tienda.ventasMes || 0) | currency }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': tienda.estado === 0,
                      'bg-danger': tienda.estado === 1
                    }">
                      {{ tienda.estado === 0 ? 'ACTIVA' : 'INACTIVA' }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="tiendas.length === 0">
                  <td colspan="5" class="text-center text-muted py-4">
                    No hay tiendas registradas
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Productos con Stock Bajo -->
      <div class="card mb-4">
        <div class="card-header bg-warning">
          <h5 class="mb-0">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Productos con Stock Bajo ({{ productosStockBajo.length }})
          </h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Tienda</th>
                  <th>Stock Actual</th>
                  <th>Stock Mínimo</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let producto of productosStockBajo.slice(0, 10)">
                  <td>{{ producto.nombreProducto }}</td>
                  <td>{{ producto.nombreTienda }}</td>
                  <td>
                    <span class="badge bg-danger">{{ producto.stockActual }}</span>
                  </td>
                  <td>{{ producto.stockMinimo }}</td>
                </tr>
                <tr *ngIf="productosStockBajo.length === 0">
                  <td colspan="4" class="text-center text-muted py-3">
                    No hay productos con stock bajo
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="productosStockBajo.length > 10" class="text-center">
              <small class="text-muted">Mostrando 10 de {{ productosStockBajo.length }} productos</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Actividad Reciente -->
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Actividad Reciente</h5>
        </div>
        <div class="card-body">
          <div class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            El historial de actividad se mostrará aquí próximamente
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
    }
    .fs-1 {
      font-size: 3rem !important;
    }
  `]
})
export class AdminReportesComponent implements OnInit {
  stats: EstadisticasGlobales = {
    totalTiendas: 0,
    tiendasActivas: 0,
    totalProductos: 0,
    productosStockBajo: 0,
    totalUsuarios: 0,
    usuariosActivos: 0,
    ventasHoy: 0,
    ventasMes: 0
  };

  tiendas: any[] = [];
  productosStockBajo: any[] = [];
  loading = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.loading = true;

    // Cargar tiendas
    this.http.get<any[]>(`${environment.apiUrl}/tiendas`).subscribe({
      next: (tiendas) => {
        this.tiendas = tiendas.map(t => ({
          ...t,
          nombreDueno: t.nombreDueño,
          estado: Number(t.estado)
        }));
        this.stats.totalTiendas = tiendas.length;
        this.stats.tiendasActivas = tiendas.filter((t: any) => Number(t.estado) === 0).length;
      },
      error: (error) => console.error('Error cargando tiendas', error)
    });

    // Cargar productos
    this.http.get<any[]>(`${environment.apiUrl}/productos`).subscribe({
      next: (productos) => {
        this.stats.totalProductos = productos.length;
        this.productosStockBajo = productos.filter((p: any) =>
          p.stockActual <= p.stockMinimo && p.stockActual > 0
        );
        this.stats.productosStockBajo = this.productosStockBajo.length;
      },
      error: (error) => console.error('Error cargando productos', error)
    });

    // Cargar usuarios
    this.http.get<any[]>(`${environment.apiUrl}/usuarios`).subscribe({
      next: (usuarios) => {
        this.stats.totalUsuarios = usuarios.length;
        this.stats.usuariosActivos = usuarios.filter((u: any) => Number(u.estado) === 0).length;
      },
      error: (error) => console.error('Error cargando usuarios', error)
    });

    // Las ventas requerirían un endpoint específico de reportes globales
    // Por ahora dejamos en 0
    this.stats.ventasHoy = 0;
    this.stats.ventasMes = 0;

    this.loading = false;
  }
}
