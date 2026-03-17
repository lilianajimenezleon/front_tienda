import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TiendaService } from '../../core/services';
import { first } from 'rxjs/operators';

interface Tienda {
  idTienda: string;
  nombreTienda: string;
  direccion?: string;
  telefono?: string;
  correoTienda?: string;
  nit?: string;
  idDueno: string;
  nombreDueno: string;
  estado: number; // Cambiado a number
}

@Component({
  selector: 'app-admin-tiendas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-shop me-2"></i>Gestión de Tiendas</h2>
        <button class="btn btn-primary" (click)="nuevaTienda()">
          <i class="bi bi-plus-circle me-2"></i>Nueva Tienda
        </button>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Buscar por nombre..."
                [(ngModel)]="filtroNombre"
                (input)="filtrar()">
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filtroEstado" (change)="filtrar()">
                <option value="">Todos los estados</option>
                <option [value]="0">Activos</option>
                <option [value]="1">Inactivos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Tiendas -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Dueño</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>NIT</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let tienda of tiendasFiltradas">
                  <td>
                    <strong>{{ tienda.nombreTienda }}</strong>
                    <br>
                    <small class="text-muted">{{ tienda.correoTienda }}</small>
                  </td>
                  <td>{{ tienda.nombreDueno }}</td>
                  <td>{{ tienda.direccion || 'N/A' }}</td>
                  <td>{{ tienda.telefono || 'N/A' }}</td>
                  <td>{{ tienda.nit || 'N/A' }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': tienda.estado === 0,
                      'bg-danger': tienda.estado === 1,
                      'bg-warning': tienda.estado === 2
                    }">
                      {{ getEstadoName(tienda.estado) }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" (click)="editar(tienda)" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button 
                        class="btn btn-outline-warning" 
                        (click)="cambiarEstado(tienda)"
                        [title]="tienda.estado === 0 ? 'Desactivar' : 'Activar'">
                        <i class="bi bi-power"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="tiendasFiltradas.length === 0">
                  <td colspan="7" class="text-center text-muted py-4">
                    No se encontraron tiendas
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
              <h6>Total Tiendas</h6>
              <h3>{{ tiendas.length }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <h6>Activas</h6>
              <h3>{{ contarPorEstado(0) }}</h3>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-danger text-white">
            <div class="card-body">
              <h6>Inactivas</h6>
              <h3>{{ contarPorEstado(1) }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    .btn-group-sm .btn {
      padding: 0.25rem 0.5rem;
    }
  `]
})
export class AdminTiendasComponent implements OnInit {
  tiendas: Tienda[] = [];
  tiendasFiltradas: Tienda[] = [];
  filtroNombre = '';
  filtroEstado: string | number = '';
  loading = false;

  constructor(
    private tiendaService: TiendaService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarTiendas();
  }

  cargarTiendas() {
    this.loading = true;
    this.tiendaService.getAll().subscribe({
      next: (data: any[]) => {
        // Mapear los datos para manejar la ñ y asegurar tipos
        this.tiendas = data.map(t => ({
          ...t,
          idDueno: t.idDueño,
          nombreDueno: t.nombreDueño,
          estado: Number(t.estado)
        }));
        this.tiendasFiltradas = this.tiendas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando tiendas', error);
        this.loading = false;
      }
    });
  }

  filtrar() {
    this.tiendasFiltradas = this.tiendas.filter(t => {
      const matchNombre = !this.filtroNombre ||
        t.nombreTienda.toLowerCase().includes(this.filtroNombre.toLowerCase()) ||
        t.nombreDueno.toLowerCase().includes(this.filtroNombre.toLowerCase());

      const matchEstado = this.filtroEstado === '' || t.estado === Number(this.filtroEstado);

      return matchNombre && matchEstado;
    });
  }

  contarPorEstado(estado: number): number {
    return this.tiendas.filter(t => t.estado === estado).length;
  }

  getEstadoName(estado: number): string {
    switch (estado) {
      case 0: return 'ACTIVO';
      case 1: return 'INACTIVO';
      case 2: return 'BLOQUEADO';
      default: return 'DESCONOCIDO';
    }
  }

  nuevaTienda() {
    this.router.navigate(['/admin/tiendas/nueva']);
  }

  editar(tienda: Tienda) {
    this.router.navigate(['/admin/tiendas', tienda.idTienda]);
  }

  cambiarEstado(tienda: Tienda) {
    const nuevoEstado = tienda.estado === 0 ? 1 : 0;

    // Usamos any para evitar problemas de tipo con la interfaz del servicio si no está actualizada
    const updateData: any = {
      estado: nuevoEstado
    };

    this.tiendaService.update(tienda.idTienda, updateData).pipe(first()).subscribe({
      next: () => {
        tienda.estado = nuevoEstado;
      },
      error: (error) => {
        console.error('Error cambiando estado', error);
        alert('Error al cambiar el estado de la tienda');
      }
    });
  }
}
