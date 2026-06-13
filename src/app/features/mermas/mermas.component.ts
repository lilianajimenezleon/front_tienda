import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MermaService, CrearMermaDto } from '../../core/services/merma.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../core/models/product.models';

@Component({
    selector: 'app-mermas',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-exclamation-triangle me-2"></i>Mermas</h2>
        <button class="btn btn-warning" (click)="showForm = !showForm">
          <i class="bi bi-plus-lg me-2"></i>Registrar Merma
        </button>
      </div>

      <div class="card mb-4" *ngIf="showForm">
        <div class="card-header">
          <h5 class="mb-0">Nueva Merma</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Producto</label>
              <select class="form-select" [(ngModel)]="formData.idProducto">
                <option value="">Seleccione un producto</option>
                <option *ngFor="let p of productos" [value]="p.idProducto">
                  {{ p.nombreProducto }} (Stock: {{ p.stockActual }})
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Cantidad</label>
              <input type="number" class="form-control" min="1" [(ngModel)]="formData.cantidad">
            </div>
            <div class="col-md-3">
              <label class="form-label">Motivo</label>
              <select class="form-select" [(ngModel)]="formData.motivo">
                <option value="">Seleccione motivo</option>
                <option value="CADUCIDAD">Caducidad</option>
                <option value="ROBO">Robo</option>
                <option value="DAÑO">Daño</option>
                <option value="VENCIMIENTO">Vencimiento</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Descripción</label>
              <input type="text" class="form-control" [(ngModel)]="formData.descripcion" placeholder="Opcional">
            </div>
            <div class="col-12">
              <button class="btn btn-primary" (click)="registrarMerma()" [disabled]="!formData.idProducto || !formData.cantidad || !formData.motivo">
                <i class="bi bi-save me-2"></i>Guardar
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
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Motivo</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let m of mermas">
                  <td>{{ m.fechaMerma | date:'short' }}</td>
                  <td>{{ m.nombreProducto || 'N/A' }}</td>
                  <td><span class="badge bg-danger">{{ m.cantidad }}</span></td>
                  <td>{{ m.motivo || 'N/A' }}</td>
                  <td>{{ m.descripcion || '-' }}</td>
                </tr>
                <tr *ngIf="mermas.length === 0">
                  <td colspan="5" class="text-center text-muted py-4">No hay mermas registradas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card mt-4" *ngIf="mermas.length > 0">
        <div class="card-header"><h5 class="mb-0">Resumen por Motivo</h5></div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3 mb-2" *ngFor="let item of resumenMotivos">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h6>{{ item.nombre }}</h6>
                  <h4>{{ item.cantidad }}</h4>
                  <small class="text-muted">{{ item.porcentaje }}%</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
})
export class MermasComponent implements OnInit {
    mermas: any[] = [];
    productos: Producto[] = [];
    showForm = false;
    successMsg = '';
    errorMsg = '';

    formData: CrearMermaDto = {
        idTienda: '',
        idProducto: '',
        cantidad: 1,
        motivo: '',
        descripcion: ''
    };

    constructor(
        private mermaService: MermaService,
        private authService: AuthService,
        private productoService: ProductoService
    ) { }

    ngOnInit() {
        const tiendaId = this.authService.getTiendaIdFromToken();
        if (tiendaId) {
            this.formData.idTienda = tiendaId;
            this.cargarMermas(tiendaId);
            this.cargarProductos(tiendaId);
        }
    }

    cargarMermas(idTienda: string) {
        this.mermaService.getByTienda(idTienda).subscribe({
            next: (data) => { this.mermas = data; },
            error: () => { this.errorMsg = 'Error al cargar mermas'; }
        });
    }

    cargarProductos(idTienda: string) {
        this.productoService.getByTienda(idTienda).subscribe({
            next: (data) => { this.productos = data; },
            error: () => {}
        });
    }

    registrarMerma() {
        this.successMsg = '';
        this.errorMsg = '';
        this.mermaService.create(this.formData).subscribe({
            next: () => {
                this.successMsg = 'Merma registrada correctamente';
                this.showForm = false;
                const tiendaId = this.authService.getTiendaIdFromToken();
                if (tiendaId) this.cargarMermas(tiendaId);
                this.formData = { ...this.formData, idProducto: '', cantidad: 1, motivo: '', descripcion: '' };
            },
            error: () => { this.errorMsg = 'Error al registrar merma'; }
        });
    }

    get resumenMotivos(): any[] {
        if (!this.mermas.length) return [];
        const agrupado: Record<string, number> = {};
        this.mermas.forEach(m => {
            const key = m.motivo || 'Sin especificar';
            agrupado[key] = (agrupado[key] || 0) + (m.cantidad || 0);
        });
        const total = Object.values(agrupado).reduce((a, b) => a + b, 0);
        return Object.entries(agrupado).map(([nombre, cantidad]) => ({
            nombre, cantidad, porcentaje: total > 0 ? ((cantidad / total) * 100).toFixed(1) : 0
        }));
    }
}
