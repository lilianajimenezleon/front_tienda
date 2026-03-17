import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Proveedor {
  idProveedor: string;
  idTienda: string;
  nombreProveedor: string;
  nit?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  estado: number;
}

interface Tienda {
  idTienda: string;
  nombreTienda: string;
}

@Component({
  selector: 'app-admin-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-truck me-2"></i>Gestión de Proveedores</h2>
        <button class="btn btn-primary" (click)="mostrarFormulario = true">
          <i class="bi bi-plus-circle me-2"></i>Nuevo Proveedor
        </button>
      </div>

      <!-- Formulario -->
      <div class="card mb-4" *ngIf="mostrarFormulario">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">Nuevo Proveedor</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Tienda *</label>
              <select class="form-select" [(ngModel)]="formulario.idTienda">
                <option value="">Seleccione una tienda...</option>
                <option *ngFor="let tienda of tiendas" [value]="tienda.idTienda">
                  {{ tienda.nombreTienda }}
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Nombre Proveedor *</label>
              <input type="text" class="form-control" [(ngModel)]="formulario.nombreProveedor">
            </div>
            <div class="col-md-4">
              <label class="form-label">NIT</label>
              <input type="text" class="form-control" [(ngModel)]="formulario.nit">
            </div>
            <div class="col-md-4">
              <label class="form-label">Teléfono</label>
              <input type="text" class="form-control" [(ngModel)]="formulario.telefono">
            </div>
            <div class="col-md-4">
              <label class="form-label">Correo</label>
              <input type="email" class="form-control" [(ngModel)]="formulario.correo">
            </div>
            <div class="col-md-12">
              <label class="form-label">Dirección</label>
              <input type="text" class="form-control" [(ngModel)]="formulario.direccion">
            </div>
          </div>
          <div class="mt-3">
            <button class="btn btn-success me-2" (click)="guardar()" [disabled]="loading">
              <i class="bi bi-check-circle me-1"></i>Guardar
            </button>
            <button class="btn btn-secondary" (click)="cancelar()">
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Buscar proveedor..."
                [(ngModel)]="filtroTexto"
                (input)="filtrar()">
            </div>
            <div class="col-md-4">
              <select class="form-select" [(ngModel)]="filtroTienda" (change)="filtrar()">
                <option value="">Todas las tiendas</option>
                <option *ngFor="let tienda of tiendas" [value]="tienda.idTienda">
                  {{ tienda.nombreTienda }}
                </option>
              </select>
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

      <!-- Tabla -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>NIT</th>
                  <th>Contacto</th>
                  <th>Tienda</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let proveedor of proveedoresFiltrados">
                  <td>
                    <strong>{{ proveedor.nombreProveedor }}</strong>
                    <br>
                    <small class="text-muted">{{ proveedor.direccion || 'Sin dirección' }}</small>
                  </td>
                  <td>{{ proveedor.nit || 'N/A' }}</td>
                  <td>
                    <div *ngIf="proveedor.telefono">
                      <i class="bi bi-telephone"></i> {{ proveedor.telefono }}
                    </div>
                    <div *ngIf="proveedor.correo">
                      <i class="bi bi-envelope"></i> {{ proveedor.correo }}
                    </div>
                    <span *ngIf="!proveedor.telefono && !proveedor.correo" class="text-muted">N/A</span>
                  </td>
                  <td>{{ getTiendaNombre(proveedor.idTienda) }}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': proveedor.estado === 0,
                      'bg-danger': proveedor.estado === 1
                    }">
                      {{ proveedor.estado === 0 ? 'ACTIVO' : 'INACTIVO' }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-warning" (click)="cambiarEstado(proveedor)" title="Cambiar estado">
                        <i class="bi bi-power"></i>
                      </button>
                      <button class="btn btn-outline-danger" (click)="eliminar(proveedor)" title="Eliminar">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="proveedoresFiltrados.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">
                    No se encontraron proveedores
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
              <h6>Total Proveedores</h6>
              <h3>{{ proveedores.length }}</h3>
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
export class AdminProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = [];
  tiendas: Tienda[] = [];
  filtroTexto = '';
  filtroTienda = '';
  filtroEstado: string | number = '';
  loading = false;
  mostrarFormulario = false;

  formulario = {
    idTienda: '',
    nombreProveedor: '',
    nit: '',
    telefono: '',
    correo: '',
    direccion: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarTiendas();
    this.cargarProveedores();
  }

  cargarTiendas() {
    this.http.get<any[]>(`${environment.apiUrl}/tiendas`).subscribe({
      next: (data) => {
        this.tiendas = data;
      },
      error: (error) => console.error('Error cargando tiendas', error)
    });
  }

  cargarProveedores() {
    this.loading = true;
    // El backend no tiene endpoint global de proveedores
    // Por ahora dejamos vacío
    this.proveedores = [];
    this.proveedoresFiltrados = [];
    this.loading = false;
  }

  filtrar() {
    this.proveedoresFiltrados = this.proveedores.filter(p => {
      const matchTexto = !this.filtroTexto ||
        p.nombreProveedor.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        (p.nit && p.nit.toLowerCase().includes(this.filtroTexto.toLowerCase()));
      const matchTienda = !this.filtroTienda || p.idTienda === this.filtroTienda;
      const matchEstado = this.filtroEstado === '' || p.estado === Number(this.filtroEstado);
      return matchTexto && matchTienda && matchEstado;
    });
  }

  getTiendaNombre(idTienda: string): string {
    const tienda = this.tiendas.find(t => t.idTienda === idTienda);
    return tienda ? tienda.nombreTienda : 'N/A';
  }

  contarPorEstado(estado: number): number {
    return this.proveedores.filter(p => p.estado === estado).length;
  }

  guardar() {
    if (!this.formulario.idTienda || !this.formulario.nombreProveedor) {
      alert('Complete los campos requeridos');
      return;
    }

    this.loading = true;
    this.http.post(`${environment.apiUrl}/proveedores`, this.formulario).subscribe({
      next: () => {
        this.cargarProveedores();
        this.cancelar();
      },
      error: (error) => {
        console.error('Error guardando proveedor', error);
        alert('Error al guardar proveedor');
        this.loading = false;
      }
    });
  }

  cambiarEstado(proveedor: Proveedor) {
    // La funcionalidad de cambio de estado requiere endpoint específico
    alert('Funcionalidad de cambio de estado pendiente');
  }

  eliminar(proveedor: Proveedor) {
    if (confirm(`¿Eliminar el proveedor "${proveedor.nombreProveedor}"?`)) {
      this.http.delete(`${environment.apiUrl}/proveedores/${proveedor.idProveedor}`).subscribe({
        next: () => {
          this.cargarProveedores();
        },
        error: (error) => {
          console.error('Error eliminando proveedor', error);
          alert('Error al eliminar proveedor');
        }
      });
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.formulario = {
      idTienda: '',
      nombreProveedor: '',
      nit: '',
      telefono: '',
      correo: '',
      direccion: ''
    };
  }
}
