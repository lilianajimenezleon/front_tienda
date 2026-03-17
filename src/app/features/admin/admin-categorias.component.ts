import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Categoria {
  idCategoria: string;
  idTienda: string;
  nombreCategoria: string;
  descripcion?: string;
}

interface Tienda {
  idTienda: string;
  nombreTienda: string;
}

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-tags me-2"></i>Gestión de Categorías</h2>
        <button class="btn btn-primary" (click)="mostrarFormulario = true">
          <i class="bi bi-plus-circle me-2"></i>Nueva Categoría
        </button>
      </div>

      <!-- Formulario de Nueva Categoría -->
      <div class="card mb-4" *ngIf="mostrarFormulario">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">{{ categoriaEditando ? 'Editar' : 'Nueva' }} Categoría</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Tienda *</label>
              <select class="form-select" [(ngModel)]="formulario.idTienda" [disabled]="!!categoriaEditando">
                <option value="">Seleccione una tienda...</option>
                <option *ngFor="let tienda of tiendas" [value]="tienda.idTienda">
                  {{ tienda.nombreTienda }}
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Nombre Categoría *</label>
              <input type="text" class="form-control" [(ngModel)]="formulario.nombreCategoria">
            </div>
            <div class="col-md-12">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" rows="2" [(ngModel)]="formulario.descripcion"></textarea>
            </div>
          </div>
          <div class="mt-3">
            <button class="btn btn-success me-2" (click)="guardarCategoria()" [disabled]="loading">
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
                placeholder="Buscar categoría..."
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
          </div>
        </div>
      </div>

      <!-- Tabla de Categorías -->
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th>Tienda</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let categoria of categoriasFiltradas">
                  <td><strong>{{ categoria.nombreCategoria }}</strong></td>
                  <td>{{ categoria.descripcion || 'Sin descripción' }}</td>
                  <td>{{ getTiendaNombre(categoria.idTienda) }}</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-danger" (click)="eliminar(categoria)" title="Eliminar">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="categoriasFiltradas.length === 0">
                  <td colspan="4" class="text-center text-muted py-4">
                    No se encontraron categorías
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="row mt-4">
        <div class="col-md-4">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <h6>Total Categorías</h6>
              <h3>{{ categorias.length }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminCategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  tiendas: Tienda[] = [];
  filtroTexto = '';
  filtroTienda = '';
  loading = false;
  mostrarFormulario = false;
  categoriaEditando: Categoria | null = null;

  formulario = {
    idTienda: '',
    nombreCategoria: '',
    descripcion: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarTiendas();
    this.cargarCategorias();
  }

  cargarTiendas() {
    this.http.get<any[]>(`${environment.apiUrl}/tiendas`).subscribe({
      next: (data) => {
        this.tiendas = data;
      },
      error: (error) => console.error('Error cargando tiendas', error)
    });
  }

  cargarCategorias() {
    this.loading = true;
    // El backend no tiene endpoint global, así que cargaremos por tienda
    // Por ahora mostraremos mensaje
    this.categorias = [];
    this.categoriasFiltradas = [];
    this.loading = false;
  }

  filtrar() {
    this.categoriasFiltradas = this.categorias.filter(c => {
      const matchTexto = !this.filtroTexto ||
        c.nombreCategoria.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const matchTienda = !this.filtroTienda || c.idTienda === this.filtroTienda;
      return matchTexto && matchTienda;
    });
  }

  getTiendaNombre(idTienda: string): string {
    const tienda = this.tiendas.find(t => t.idTienda === idTienda);
    return tienda ? tienda.nombreTienda : 'N/A';
  }

  guardarCategoria() {
    if (!this.formulario.idTienda || !this.formulario.nombreCategoria) {
      alert('Complete los campos requeridos');
      return;
    }

    this.loading = true;
    this.http.post(`${environment.apiUrl}/categorias`, this.formulario).subscribe({
      next: () => {
        this.cargarCategorias();
        this.cancelar();
      },
      error: (error) => {
        console.error('Error guardando categoría', error);
        alert('Error al guardar categoría');
        this.loading = false;
      }
    });
  }

  eliminar(categoria: Categoria) {
    if (confirm(`¿Eliminar la categoría "${categoria.nombreCategoria}"?`)) {
      this.http.delete(`${environment.apiUrl}/categorias/${categoria.idCategoria}`).subscribe({
        next: () => {
          this.cargarCategorias();
        },
        error: (error) => {
          console.error('Error eliminando categoría', error);
          alert('Error al eliminar categoría');
        }
      });
    }
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.categoriaEditando = null;
    this.formulario = {
      idTienda: '',
      nombreCategoria: '',
      descripcion: ''
    };
  }
}
