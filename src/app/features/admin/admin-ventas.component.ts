import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-cart-check me-2"></i>Historial Global de Ventas</h2>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label">Fecha Inicio</label>
              <input type="date" class="form-control" [(ngModel)]="fechaInicio">
            </div>
            <div class="col-md-3">
              <label class="form-label">Fecha Fin</label>
              <input type="date" class="form-control" [(ngModel)]="fechaFin">
            </div>
            <div class="col-md-3">
              <label class="form-label">Tienda</label>
              <select class="form-select" [(ngModel)]="filtroTienda">
                <option value="">Todas las tiendas</option>
                <option *ngFor="let tienda of tiendas" [value]="tienda.idTienda">
                  {{ tienda.nombreTienda }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">&nbsp;</label>
              <button class="btn btn-primary w-100" (click)="buscar()">
                <i class="bi bi-search me-2"></i>Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="row g-3 mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <h6>Total Ventas</h6>
              <h3>{{ ventas.length }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <h6>Monto Total</h6>
              <h3>{{ calcularTotal() | currency }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tienda</th>
                  <th>Usuario</th>
                  <th>Total</th>
                  <th>Método Pago</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let venta of ventas">
                  <td>{{ venta.fechaVenta | date:'short' }}</td>
                  <td>{{ venta.nombreTienda || 'N/A' }}</td>
                  <td>{{ venta.nombreUsuario || 'N/A' }}</td>
                  <td><strong>{{ venta.totalVenta | currency }}</strong></td>
                  <td>{{ venta.metodoPago || 'N/A' }}</td>
                  <td>
                    <span class="badge bg-success">COMPLETADA</span>
                  </td>
                </tr>
                <tr *ngIf="ventas.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">
                    No se encontraron ventas
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminVentasComponent implements OnInit {
  ventas: any[] = [];
  tiendas: any[] = [];
  fechaInicio = '';
  fechaFin = '';
  filtroTienda = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarTiendas();
    this.cargarVentas();
  }

  cargarTiendas() {
    this.http.get<any[]>(`${environment.apiUrl}/tiendas`).subscribe({
      next: (data) => {
        this.tiendas = data;
      },
      error: (error) => console.error('Error cargando tiendas', error)
    });
  }

  cargarVentas() {
    // El backend no tiene endpoint global de ventas
    // Requeriría implementación en el backend
    this.ventas = [];
  }

  buscar() {
    this.cargarVentas();
  }

  calcularTotal(): number {
    return this.ventas.reduce((sum, v) => sum + (v.totalVenta || 0), 0);
  }
}
