import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-mermas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-exclamation-triangle me-2"></i>Historial Global de Mermas</h2>
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
          <div class="card bg-warning text-dark">
            <div class="card-body">
              <h6>Total Mermas</h6>
              <h3>{{ mermas.length }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-danger text-white">
            <div class="card-body">
              <h6>Cantidad Total</h6>
              <h3>{{ calcularCantidadTotal() }}</h3>
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
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Motivo</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let merma of mermas">
                  <td>{{ merma.fechaMerma | date:'short' }}</td>
                  <td>{{ merma.nombreTienda || 'N/A' }}</td>
                  <td>{{ merma.nombreProducto || 'N/A' }}</td>
                  <td>
                    <span class="badge bg-danger">{{ merma.cantidad }}</span>
                  </td>
                  <td>{{ merma.motivo || 'N/A' }}</td>
                  <td>{{ merma.descripcion || 'Sin descripción' }}</td>
                </tr>
                <tr *ngIf="mermas.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">
                    No se encontraron mermas
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Resumen por Motivo -->
      <div class="card mt-4">
        <div class="card-header">
          <h5 class="mb-0">Resumen por Motivo</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3" *ngFor="let motivo of obtenerMotivosSummary()">
              <div class="card bg-light">
                <div class="card-body">
                  <h6>{{ motivo.nombre }}</h6>
                  <h4>{{ motivo.cantidad }}</h4>
                  <small class="text-muted">{{ motivo.porcentaje }}%</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminMermasComponent implements OnInit {
  mermas: any[] = [];
  tiendas: any[] = [];
  fechaInicio = '';
  fechaFin = '';
  filtroTienda = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarTiendas();
    this.cargarMermas();
  }

  cargarTiendas() {
    this.http.get<any[]>(`${environment.apiUrl}/tiendas`).subscribe({
      next: (data) => {
        this.tiendas = data;
      },
      error: (error) => console.error('Error cargando tiendas', error)
    });
  }

  cargarMermas() {
    // El backend no tiene endpoint global de mermas
    // Requeriría implementación
    this.mermas = [];
  }

  buscar() {
    this.cargarMermas();
  }

  calcularCantidadTotal(): number {
    return this.mermas.reduce((sum, m) => sum + (m.cantidad || 0), 0);
  }

  obtenerMotivosSummary(): any[] {
    if (this.mermas.length === 0) return [];

    const motivos = this.mermas.reduce((acc: any, merma) => {
      const motivo = merma.motivo || 'Sin especificar';
      if (!acc[motivo]) {
        acc[motivo] = 0;
      }
      acc[motivo] += merma.cantidad || 0;
      return acc;
    }, {});

    const total = this.calcularCantidadTotal();

    return Object.keys(motivos).map(key => ({
      nombre: key,
      cantidad: motivos[key],
      porcentaje: total > 0 ? ((motivos[key] / total) * 100).toFixed(1) : 0
    }));
  }
}
