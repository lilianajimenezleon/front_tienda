import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-bag-check me-2"></i>Historial Global de Compras</h2>
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
          <div class="card bg-info text-white">
            <div class="card-body">
              <h6>Total Compras</h6>
              <h3>{{ compras.length }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-primary text-white">
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
                  <th>Proveedor</th>
                  <th>N° Factura</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let compra of compras">
                  <td>{{ compra.fechaCompra | date:'short' }}</td>
                  <td>{{ compra.nombreTienda || 'N/A' }}</td>
                  <td>{{ compra.nombreProveedor || 'Sin proveedor' }}</td>
                  <td>{{ compra.numeroFactura || 'N/A' }}</td>
                  <td><strong>{{ compra.totalCompra | currency }}</strong></td>
                  <td>
                    <span class="badge bg-success">ACTIVA</span>
                  </td>
                </tr>
                <tr *ngIf="compras.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">
                    No se encontraron compras
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
export class AdminComprasComponent implements OnInit {
  compras: any[] = [];
  tiendas: any[] = [];
  fechaInicio = '';
  fechaFin = '';
  filtroTienda = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarTiendas();
    this.cargarCompras();
  }

  cargarTiendas() {
    this.http.get<any[]>(`${environment.apiUrl}/tiendas`).subscribe({
      next: (data) => {
        this.tiendas = data;
      },
      error: (error) => console.error('Error cargando tiendas', error)
    });
  }

  cargarCompras() {
    // Intentar cargar todas las compras
    this.http.get<any[]>(`${environment.apiUrl}/compras`).subscribe({
      next: (data) => {
        this.compras = data;
      },
      error: (error) => {
        console.error('Error cargando compras', error);
        this.compras = [];
      }
    });
  }

  buscar() {
    this.cargarCompras();
  }

  calcularTotal(): number {
    return this.compras.reduce((sum, c) => sum + (c.totalCompra || 0), 0);
  }
}
