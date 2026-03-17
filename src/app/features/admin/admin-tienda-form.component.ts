import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TiendaService, UserService } from '../../core/services';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-admin-tienda-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-shop me-2"></i>{{ isEditMode ? 'Editar Tienda' : 'Nueva Tienda' }}</h2>
        <button class="btn btn-outline-secondary" routerLink="/admin/tiendas">
          <i class="bi bi-arrow-left me-2"></i>Volver
        </button>
      </div>

      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-body">
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="row g-3">
                  
                  <!-- Nombre Tienda -->
                  <div class="col-md-12">
                    <label class="form-label">Nombre Tienda *</label>
                    <input type="text" formControlName="nombreTienda" class="form-control"
                           [ngClass]="{ 'is-invalid': submitted && form.get('nombreTienda')?.errors }">
                    <div *ngIf="submitted && form.get('nombreTienda')?.errors" class="invalid-feedback">
                      El nombre de la tienda es requerido
                    </div>
                  </div>

                  <!-- Dirección -->
                  <div class="col-md-6">
                    <label class="form-label">Dirección</label>
                    <input type="text" formControlName="direccion" class="form-control">
                  </div>

                  <!-- Teléfono -->
                  <div class="col-md-6">
                    <label class="form-label">Teléfono</label>
                    <input type="text" formControlName="telefono" class="form-control">
                  </div>

                  <!-- Correo Tienda -->
                  <div class="col-md-6">
                    <label class="form-label">Correo Tienda</label>
                    <input type="email" formControlName="correoTienda" class="form-control"
                           [ngClass]="{ 'is-invalid': submitted && form.get('correoTienda')?.errors }">
                    <div *ngIf="submitted && form.get('correoTienda')?.errors" class="invalid-feedback">
                      Correo inválido
                    </div>
                  </div>

                  <!-- NIT -->
                  <div class="col-md-6">
                    <label class="form-label">NIT</label>
                    <input type="text" formControlName="nit" class="form-control">
                  </div>

                  <!-- Dueño -->
                  <div class="col-md-12">
                    <label class="form-label">Dueño *</label>
                    <select formControlName="idDueno" class="form-select"
                            [ngClass]="{ 'is-invalid': submitted && form.get('idDueno')?.errors }">
                      <option value="">Seleccione un dueño...</option>
                      <option *ngFor="let dueno of duenos" [value]="dueno.idUsuario">
                        {{dueno.nombreCompleto}} ({{dueno.usuario}})
                      </option>
                    </select>
                    <div *ngIf="submitted && form.get('idDueno')?.errors" class="invalid-feedback">
                      Seleccione un dueño
                    </div>
                  </div>

                  <!-- Estado (Solo edición) -->
                  <div class="col-md-6" *ngIf="isEditMode">
                    <label class="form-label">Estado</label>
                    <select formControlName="estado" class="form-select">
                      <option [value]="0">Activo</option>
                      <option [value]="1">Inactivo</option>
                      <option [value]="2">Bloqueado</option>
                    </select>
                  </div>

                </div>

                <div class="mt-4 d-flex justify-content-end gap-2">
                  <button type="button" routerLink="/admin/tiendas" class="btn btn-secondary">Cancelar</button>
                  <button type="submit" [disabled]="loading" class="btn btn-success">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                    <i *ngIf="!loading" class="bi bi-check-circle me-1"></i>
                    {{ isEditMode ? 'Actualizar' : 'Crear' }} Tienda
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminTiendaFormComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    isEditMode = false;
    duenos: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private tiendaService: TiendaService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            nombreTienda: ['', Validators.required],
            direccion: [''],
            telefono: [''],
            correoTienda: ['', Validators.email],
            nit: [''],
            idDueno: ['', Validators.required],
            estado: [0]
        });

        this.loadDuenos();

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.loadTienda(id);
        }
    }

    loadDuenos() {
        this.userService.getAll().subscribe({
            next: (users: any[]) => {
                // Filtrar solo usuarios con rol DUEÑO_TIENDA (1)
                this.duenos = users.filter(u => u.rol === 1);
            },
            error: (error) => {
                console.error('Error cargando dueños', error);
            }
        });
    }

    loadTienda(id: string) {
        this.loading = true;
        this.tiendaService.getById(id).subscribe({
            next: (tienda: any) => {
                this.form.patchValue({
                    nombreTienda: tienda.nombreTienda,
                    direccion: tienda.direccion,
                    telefono: tienda.telefono,
                    correoTienda: tienda.correoTienda,
                    nit: tienda.nit,
                    idDueno: tienda.idDueño, // Nota: Backend usa idDueño con ñ
                    estado: tienda.estado
                });
                this.loading = false;
            },
            error: (error) => {
                console.error('Error cargando tienda', error);
                this.loading = false;
                alert('Error al cargar tienda');
                this.router.navigate(['/admin/tiendas']);
            }
        });
    }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        const formData = this.form.value;

        // Mapear idDueno a idDueño si es necesario para el backend?
        // El DTO de CrearTiendaDto usa IdDueño.
        // El DTO de ActualizarTiendaDto NO tiene IdDueño (no se puede cambiar dueño al editar tienda normalmente, o sí?)
        // Revisemos DTOs.

        /*
        public record CrearTiendaDto(
            string NombreTienda,
            string? Direccion,
            string? Telefono,
            string? CorreoTienda,
            string? Nit,
            Guid IdDueño
        );
    
        public record ActualizarTiendaDto(
            string? NombreTienda,
            string? Direccion,
            string? Telefono,
            string? CorreoTienda,
            string? Nit
        );
        */

        // ActualizarTiendaDto NO tiene Estado ni IdDueño.
        // Necesito modificar ActualizarTiendaDto en el backend si quiero cambiar estado o dueño.
        // Por ahora, asumiré que solo se editan datos básicos.
        // Pero el usuario quiere "activar/desactivar", así que necesito Estado en Update.

        if (this.isEditMode) {
            const id = this.route.snapshot.paramMap.get('id');
            if (id) {
                // Preparar datos para update
                // OJO: Necesito agregar Estado a ActualizarTiendaDto en backend igual que hice con Usuario.
                const updateData: any = {
                    nombreTienda: formData.nombreTienda,
                    direccion: formData.direccion,
                    telefono: formData.telefono,
                    correoTienda: formData.correoTienda,
                    nit: formData.nit,
                    estado: Number(formData.estado) // Necesito agregar esto al backend
                };

                this.tiendaService.update(id, updateData).pipe(first()).subscribe({
                    next: () => {
                        this.router.navigate(['/admin/tiendas']);
                    },
                    error: (error) => {
                        console.error('Error actualizando tienda', error);
                        this.loading = false;
                        alert('Error al actualizar tienda');
                    }
                });
            }
        } else {
            const createData: any = {
                nombreTienda: formData.nombreTienda,
                direccion: formData.direccion,
                telefono: formData.telefono,
                correoTienda: formData.correoTienda,
                nit: formData.nit,
                idDueño: formData.idDueno // Mapeo importante
            };

            this.tiendaService.create(createData).pipe(first()).subscribe({
                next: () => {
                    this.router.navigate(['/admin/tiendas']);
                },
                error: (error) => {
                    console.error('Error creando tienda', error);
                    this.loading = false;
                    alert('Error al crear tienda');
                }
            });
        }
    }
}
