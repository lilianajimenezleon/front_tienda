import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="row">
      <div class="col-12 mb-4">
        <h2>Dashboard</h2>
        <p class="text-muted">Bienvenido al sistema de gestión de inventario.</p>
      </div>
    </div>

    <div class="row g-4">
      <!-- Tarjeta Ventas Hoy -->
      <div class="col-md-3">
        <div class="card bg-primary text-white h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title mb-0">Ventas Hoy</h6>
                <h2 class="my-2">$0.00</h2>
                <small><i class="bi bi-arrow-up"></i> 0% vs ayer</small>
              </div>
              <i class="bi bi-currency-dollar fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjeta Productos -->
      <div class="col-md-3">
        <div class="card bg-success text-white h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title mb-0">Productos</h6>
                <h2 class="my-2">0</h2>
                <small>En inventario</small>
              </div>
              <i class="bi bi-box-seam fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjeta Stock Bajo -->
      <div class="col-md-3">
        <div class="card bg-warning text-dark h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title mb-0">Stock Bajo</h6>
                <h2 class="my-2">0</h2>
                <small class="text-danger">Requiere atención</small>
              </div>
              <i class="bi bi-exclamation-triangle fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjeta Usuarios -->
      <div class="col-md-3">
        <div class="card bg-info text-white h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-title mb-0">Usuarios</h6>
                <h2 class="my-2">0</h2>
                <small>Activos</small>
              </div>
              <i class="bi bi-people fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-8">
        <div class="card h-100">
          <div class="card-header bg-white">
            <h5 class="card-title mb-0">Ventas Recientes</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                      No hay ventas recientes
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-header bg-white">
            <h5 class="card-title mb-0">Alertas de Stock</h5>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item text-center text-muted py-4">
                No hay alertas pendientes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
    constructor() { }
    ngOnInit(): void { }
}
