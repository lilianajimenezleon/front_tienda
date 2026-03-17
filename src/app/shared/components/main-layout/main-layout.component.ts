import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="bi bi-shop me-2"></i>Tienda App
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="bi bi-speedometer2 me-1"></i>Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/productos" routerLinkActive="active">
                <i class="bi bi-box-seam me-1"></i>Productos
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/ventas" routerLinkActive="active">
                <i class="bi bi-cart3 me-1"></i>Ventas
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/compras" routerLinkActive="active">
                <i class="bi bi-bag me-1"></i>Compras
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/reportes" routerLinkActive="active">
                <i class="bi bi-graph-up me-1"></i>Reportes
              </a>
            </li>
          </ul>
          <div class="d-flex align-items-center text-white">
            <div class="dropdown">
              <a class="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-1"></i>
                {{ (authService.currentUser | async)?.nombreCompleto }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" routerLink="/cambiar-password"><i class="bi bi-person me-2"></i>Cambiar Contraseña</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger" (click)="logout()">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="container-fluid mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar-brand { font-weight: bold; }
    .nav-link.active { font-weight: 500; color: white !important; }
  `]
})
export class MainLayoutComponent {
  constructor(public authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
