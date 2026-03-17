import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface DashboardStats {
  totalUsuarios: number;
  totalTiendas: number;
  totalProductos: number;
  totalVentas: number;
  totalCompras: number;
  totalMermas: number;
  ventasMesActual: number;
  comprasMesActual: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-house-door me-2"></i>Panel de Administración</h2>
        <small class="text-muted">Bienvenido al sistema de administración</small>
      </div>

      <!-- Accesos Rápidos -->
      <div class="row g-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0"><i class="bi bi-gear me-2"></i>Gestión de Datos</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-6">
                  <a routerLink="/admin/usuarios" class="btn btn-outline-primary w-100">
                    <i class="bi bi-people me-2"></i>Usuarios
                  </a>
                </div>
                <div class="col-6">
                  <a routerLink="/admin/tiendas" class="btn btn-outline-success w-100">
                    <i class="bi bi-shop me-2"></i>Tiendas
                  </a>
                </div>
                <div class="col-6">
                  <a routerLink="/admin/productos" class="btn btn-outline-info w-100">
                    <i class="bi bi-box me-2"></i>Productos
                  </a>
                </div>
                <div class="col-6">
                  <a routerLink="/admin/categorias" class="btn btn-outline-secondary w-100">
                    <i class="bi bi-tags me-2"></i>Categorías
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0"><i class="bi bi-receipt me-2"></i>Transacciones</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-6">
                  <a routerLink="/admin/ventas" class="btn btn-outline-warning w-100">
                    <i class="bi bi-cart me-2"></i>Ventas
                  </a>
                </div>
                <div class="col-6">
                  <a routerLink="/admin/compras" class="btn btn-outline-danger w-100">
                    <i class="bi bi-bag me-2"></i>Compras
                  </a>
                </div>
                <div class="col-6">
                  <a routerLink="/admin/mermas" class="btn btn-outline-dark w-100">
                    <i class="bi bi-exclamation-triangle me-2"></i>Mermas
                  </a>
                </div>
                <div class="col-6">
                  <a routerLink="/admin/proveedores" class="btn btn-outline-primary w-100">
                    <i class="bi bi-truck me-2"></i>Proveedores
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reportes -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0"><i class="bi bi-graph-up me-2"></i>Reportes Globales</h5>
            </div>
            <div class="card-body">
              <a routerLink="/admin/reportes" class="btn btn-primary">
                <i class="bi bi-bar-chart me-2"></i>Ver Reportes Detallados
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    .btn {
      transition: all 0.2s;
    }
    .btn:hover {
      transform: scale(1.05);
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Los endpoints de estadísticas aún no están implementados en el backend
    // Por ahora solo mostramos los accesos rápidos
  }
}
