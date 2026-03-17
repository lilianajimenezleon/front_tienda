import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService, TiendaService } from '../../core/services';
import { FormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';

interface UsuarioDto {
  idUsuario: string;
  nombreCompleto: string;
  usuario: string;
  correo: string;
  rol: number;
  estado: number;
}

interface Tienda {
  idTienda: string;
  nombreTienda: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-people me-2"></i>Gestión de Usuarios</h2>
        <button class="btn btn-primary" routerLink="/admin/usuarios/nuevo">
          <i class="bi bi-plus-circle me-2"></i>Nuevo Usuario
        </button>
      </div>

      <!-- Filtro y Búsqueda -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <input type="text" class="form-control" placeholder="Buscar usuario..." [(ngModel)]="searchTerm" (input)="filterUsers()">
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="selectedTienda" (change)="filterUsers()" disabled title="Filtro por tienda no disponible temporalmente">
                <option value="">Todas las tiendas</option>
                <option *ngFor="let tienda of tiendas" [value]="tienda.idTienda">{{tienda.nombreTienda}}</option>
              </select>
            </div>
            <div class="col-md-2">
              <select class="form-select" [(ngModel)]="selectedRol" (change)="filterUsers()">
                <option value="">Todos los roles</option>
                <option [value]="0">Admin Sistema</option>
                <option [value]="1">Dueño Tienda</option>
                <option [value]="2">Empleado</option>
              </select>
            </div>
            <div class="col-md-3">
              <button class="btn btn-outline-secondary w-100" (click)="loadUsers()">
                <i class="bi bi-arrow-clockwise"></i> Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Usuarios -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Lista de Usuarios ({{filteredUsers.length}})</h5>
          <div *ngIf="loading" class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of filteredUsers">
                  <td>
                    <strong>{{user.nombreCompleto}}</strong>
                  </td>
                  <td>{{user.usuario}}</td>
                  <td>{{user.correo}}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-primary': user.rol === 0,
                      'bg-info': user.rol === 1,
                      'bg-secondary': user.rol === 2
                    }">{{getRolName(user.rol)}}</span>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': user.estado === 0,
                      'bg-danger': user.estado === 1,
                      'bg-warning': user.estado === 2
                    }">{{getEstadoName(user.estado)}}</span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm" role="group">
                      <a routerLink="/admin/usuarios/{{user.idUsuario}}" class="btn btn-outline-primary" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </a>
                      <button class="btn btn-outline-info" (click)="resetPassword(user)" *ngIf="user.rol !== 0" title="Restablecer Contraseña">
                        <i class="bi bi-key"></i>
                      </button>
                      <button class="btn btn-outline-warning" (click)="toggleStatus(user)" *ngIf="user.rol !== 0" [title]="user.estado === 0 ? 'Desactivar' : 'Activar'">
                        <i class="bi bi-power"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="filteredUsers.length === 0 && !loading">
                  <td colspan="6" class="text-center py-4 text-muted">
                    No se encontraron usuarios
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
export class AdminUsersComponent implements OnInit {
  usuarios: UsuarioDto[] = [];
  filteredUsers: UsuarioDto[] = [];
  tiendas: Tienda[] = [];
  loading = false;
  searchTerm = '';
  selectedTienda = '';
  selectedRol: string | number = '';

  constructor(
    private userService: UserService,
    private tiendaService: TiendaService
  ) { }

  ngOnInit() {
    this.loadTiendas();
    this.loadUsers();
  }

  loadTiendas() {
    this.tiendaService.getAll().subscribe({
      next: (tiendas: any[]) => {
        this.tiendas = tiendas;
      },
      error: (error) => {
        console.error('Error cargando tiendas', error);
      }
    });
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (usuarios: any[]) => {
        this.usuarios = usuarios;
        this.filteredUsers = [...this.usuarios];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando usuarios', error);
        this.loading = false;
      }
    });
  }

  filterUsers() {
    this.filteredUsers = this.usuarios.filter(user => {
      const matchesSearch =
        (user.nombreCompleto && user.nombreCompleto.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.usuario && user.usuario.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.correo && user.correo.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesTienda = true; // Placeholder

      const matchesRol = this.selectedRol === '' || user.rol === Number(this.selectedRol);

      return matchesSearch && matchesTienda && matchesRol;
    });
  }

  getRolName(rol: number): string {
    switch (rol) {
      case 0: return 'Admin Sistema';
      case 1: return 'Dueño Tienda';
      case 2: return 'Empleado';
      default: return 'Desconocido';
    }
  }

  getEstadoName(estado: number): string {
    switch (estado) {
      case 0: return 'Activo';
      case 1: return 'Inactivo';
      case 2: return 'Bloqueado';
      default: return 'Desconocido';
    }
  }

  deleteUser(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.delete(id).pipe(first()).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error eliminando usuario', error);
          alert('Error al eliminar usuario');
        }
      });
    }
  }

  toggleStatus(user: UsuarioDto) {
    const nuevoEstado = user.estado === 0 ? 1 : 0; // 0: Activo, 1: Inactivo

    // Usamos 'any' para evitar errores de tipo estricto con la interfaz Usuario del servicio
    const updateData: any = {
      estado: nuevoEstado
    };

    this.userService.update(user.idUsuario, updateData).pipe(first()).subscribe({
      next: () => {
        user.estado = nuevoEstado;
      },
      error: (error) => {
        console.error('Error actualizando estado', error);
        alert('Error al actualizar estado del usuario');
      }
    });
  }

  resetPassword(user: UsuarioDto) {
    const defaultPassword = 'Password123!';
    if (confirm(`¿Estás seguro de que deseas restablecer la contraseña a "${defaultPassword}" para el usuario ${user.nombreCompleto}?`)) {
      this.userService.resetPassword(user.idUsuario, defaultPassword).pipe(first()).subscribe({
        next: (response) => {
          alert(response.mensaje || 'Contraseña restablecida exitosamente');
        },
        error: (error) => {
          console.error('Error restableciendo contraseña', error);
          alert('Error al restablecer la contraseña del usuario');
        }
      });
    }
  }
}
