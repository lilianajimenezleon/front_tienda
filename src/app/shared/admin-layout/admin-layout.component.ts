import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <nav class="sidebar bg-dark text-white">
        <div class="sidebar-header">
          <h4 class="text-white mb-0">Panel de Administración</h4>
        </div>
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link text-white" routerLink="/admin/dashboard">
              <i class="bi bi-house-door me-2"></i>Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" routerLink="/admin/usuarios">
              <i class="bi bi-people me-2"></i>Usuarios
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" routerLink="/admin/tiendas">
              <i class="bi bi-shop me-2"></i>Tiendas
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" routerLink="/admin/productos">
              <i class="bi bi-box me-2"></i>Productos Global
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" routerLink="/admin/ventas">
              <i class="bi bi-cart me-2"></i>Ventas Global
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" routerLink="/admin/compras">
              <i class="bi bi-bag me-2"></i>Compras Global
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" routerLink="/admin/mermas">
              <i class="bi bi-exclamation-triangle me-2"></i>Mermas
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" routerLink="/admin/proveedores">
              <i class="bi bi-truck me-2"></i>Proveedores
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" routerLink="/admin/categorias">
              <i class="bi bi-tags me-2"></i>Categorías
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" routerLink="/admin/reportes">
              <i class="bi bi-graph-up me-2"></i>Reportes Globales
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-white" routerLink="/admin/cambiar-password">
              <i class="bi bi-key me-2"></i>Cambiar Contraseña
            </a>
          </li>
        </ul>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <header class="navbar navbar-expand navbar-light bg-light border-bottom">
          <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="navbar-nav ms-auto">
              <a class="nav-link" (click)="logout()" style="cursor: pointer;">
                <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
              </a>
            </div>
          </div>
        </header>

        <div class="container-fluid py-4">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }
    .sidebar {
      width: 250px;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      z-index: 1000;
    }
    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
    }
    .nav-link {
      padding: 0.75rem 1rem;
      border-left: 3px solid transparent;
    }
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-left-color: #0d6efd;
    }
    .main-content {
      margin-left: 250px;
      flex: 1;
    }
    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        height: auto;
      }
      .main-content {
        margin-left: 0;
      }
    }
  `]
})
export class AdminLayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
