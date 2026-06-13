import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService, Proveedor, CrearProveedorDto } from '../../core/services/proveedor.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-proveedores',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-truck me-2"></i>Proveedores</h2>
        <button class="btn btn-primary" (click)="showForm = !showForm">
          <i class="bi bi-plus-lg me-2"></i>Nuevo Proveedor
        </button>
      </div>

      <div class="card mb-4" *ngIf="showForm">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">Registrar Proveedor</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nombre *</label>
              <input type="text" class="form-control" [(ngModel)]="formData.nombreProveedor" placeholder="Nombre del proveedor">
            </div>
            <div class="col-md-3">
              <label class="form-label">NIT</label>
              <input type="text" class="form-control" [(ngModel)]="formData.nit" placeholder="NIT">
            </div>
            <div class="col-md-3">
              <label class="form-label">Teléfono</label>
              <input type="text" class="form-control" [(ngModel)]="formData.telefono" placeholder="Teléfono">
            </div>
            <div class="col-md-4">
              <label class="form-label">Correo</label>
              <input type="email" class="form-control" [(ngModel)]="formData.correo" placeholder="correo@ejemplo.com">
            </div>
            <div class="col-md-8">
              <label class="form-label">Dirección</label>
              <input type="text" class="form-control" [(ngModel)]="formData.direccion" placeholder="Dirección">
            </div>
            <div class="col-12">
              <button class="btn btn-success me-2" (click)="guardar()" [disabled]="!formData.nombreProveedor">
                <i class="bi bi-save me-2"></i>Guardar
              </button>
              <button class="btn btn-secondary" (click)="showForm = false; limpiarForm()">
                <i class="bi bi-x-circle me-2"></i>Cancelar
              </button>
            </div>
          </div>
          <div class="alert alert-success mt-3" *ngIf="successMsg">{{ successMsg }}</div>
          <div class="alert alert-danger mt-3" *ngIf="errorMsg">{{ errorMsg }}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Proveedor</th>
                  <th>NIT</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of proveedores">
                  <td><strong>{{ p.nombreProveedor }}</strong></td>
                  <td>{{ p.nit || 'N/A' }}</td>
                  <td>{{ p.telefono || 'N/A' }}</td>
                  <td>{{ p.correo || 'N/A' }}</td>
                  <td>{{ p.direccion || 'N/A' }}</td>
                  <td>
                    <button class="btn btn-outline-danger btn-sm" (click)="eliminar(p)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="proveedores.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">No hay proveedores registrados</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-4">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <h6>Total Proveedores</h6>
              <h3>{{ proveedores.length }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    `,
    styles: [`
        .card { border: none; box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075); }
    `]
})
export class ProveedoresComponent implements OnInit {
    proveedores: Proveedor[] = [];
    showForm = false;
    successMsg = '';
    errorMsg = '';

    formData: CrearProveedorDto = {
        idTienda: '',
        nombreProveedor: '',
        nit: '',
        telefono: '',
        correo: '',
        direccion: ''
    };

    constructor(
        private proveedorService: ProveedorService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        const user = this.authService.currentUserValue;
        if (user?.idTienda) {
            this.formData.idTienda = user.idTienda;
            this.cargarProveedores();
        }
    }

    cargarProveedores() {
        if (!this.formData.idTienda) return;
        this.proveedorService.getByTienda(this.formData.idTienda).subscribe({
            next: (data) => { this.proveedores = data; },
            error: () => { this.proveedores = []; }
        });
    }

    guardar() {
        if (!this.formData.nombreProveedor) return;
        this.proveedorService.create(this.formData).subscribe({
            next: () => {
                this.successMsg = 'Proveedor registrado exitosamente';
                this.errorMsg = '';
                this.limpiarForm();
                this.showForm = false;
                this.cargarProveedores();
            },
            error: (err) => {
                this.errorMsg = err.error?.message || 'Error al registrar proveedor';
                this.successMsg = '';
            }
        });
    }

    eliminar(p: Proveedor) {
        if (!confirm(`¿Eliminar proveedor "${p.nombreProveedor}"?`)) return;
        this.proveedorService.delete(p.idProveedor).subscribe({
            next: () => { this.cargarProveedores(); },
            error: () => { this.errorMsg = 'Error al eliminar proveedor'; }
        });
    }

    limpiarForm() {
        this.formData.nombreProveedor = '';
        this.formData.nit = '';
        this.formData.telefono = '';
        this.formData.correo = '';
        this.formData.direccion = '';
    }
}
