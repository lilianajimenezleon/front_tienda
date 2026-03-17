import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-person-plus me-2"></i>{{ isEditMode ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
        <button class="btn btn-outline-secondary" routerLink="/admin/usuarios">
          <i class="bi bi-arrow-left me-2"></i>Volver
        </button>
      </div>

      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-body">
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="row g-3">
                  
                  <!-- Nombre Completo -->
                  <div class="col-md-12">
                    <label class="form-label">Nombre Completo *</label>
                    <input type="text" formControlName="nombreCompleto" class="form-control"
                           [ngClass]="{ 'is-invalid': submitted && form.get('nombreCompleto')?.errors }">
                    <div *ngIf="submitted && form.get('nombreCompleto')?.errors" class="invalid-feedback">
                      El nombre completo es requerido
                    </div>
                  </div>

                  <!-- Usuario (Username) -->
                  <div class="col-md-6">
                    <label class="form-label">Usuario *</label>
                    <input type="text" formControlName="usuario" class="form-control"
                           [ngClass]="{ 'is-invalid': submitted && form.get('usuario')?.errors }">
                    <div *ngIf="submitted && form.get('usuario')?.errors" class="invalid-feedback">
                      El usuario es requerido
                    </div>
                  </div>

                  <!-- Correo -->
                  <div class="col-md-6">
                    <label class="form-label">Correo *</label>
                    <input type="email" formControlName="correo" class="form-control"
                           [ngClass]="{ 'is-invalid': submitted && form.get('correo')?.errors }">
                    <div *ngIf="submitted && form.get('correo')?.errors" class="invalid-feedback">
                      <div *ngIf="form.get('correo')?.errors?.['required']">El correo es requerido</div>
                      <div *ngIf="form.get('correo')?.errors?.['email']">Correo inválido</div>
                    </div>
                  </div>

                  <!-- Contraseña (Solo creación) -->
                  <div class="col-md-6" *ngIf="!isEditMode">
                    <label class="form-label">Contraseña *</label>
                    <input type="password" formControlName="contraseña" class="form-control"
                           [ngClass]="{ 'is-invalid': submitted && form.get('contraseña')?.errors }">
                    <div *ngIf="submitted && form.get('contraseña')?.errors" class="invalid-feedback">
                      La contraseña es requerida
                    </div>
                  </div>

                  <!-- Rol -->
                  <div class="col-md-6">
                    <label class="form-label">Rol *</label>
                    <select formControlName="rol" class="form-select"
                            [ngClass]="{ 'is-invalid': submitted && form.get('rol')?.errors }">
                      <option value="">Seleccione un rol...</option>
                      <option [value]="0">Admin Sistema</option>
                      <option [value]="1">Dueño Tienda</option>
                      <option [value]="2">Empleado</option>
                    </select>
                    <div *ngIf="submitted && form.get('rol')?.errors" class="invalid-feedback">
                      Seleccione un rol
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
                  <button type="button" routerLink="/admin/usuarios" class="btn btn-secondary">Cancelar</button>
                  <button type="submit" [disabled]="loading" class="btn btn-success">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                    <i *ngIf="!loading" class="bi bi-check-circle me-1"></i>
                    {{ isEditMode ? 'Actualizar' : 'Crear' }} Usuario
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
export class AdminUserFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  isEditMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombreCompleto: ['', Validators.required],
      usuario: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: [''],
      rol: [2, Validators.required],
      estado: [0]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.form.get('usuario')?.disable();
      this.form.get('contraseña')?.clearValidators();
      this.form.get('contraseña')?.updateValueAndValidity();
      this.loadUser(id);
    } else {
      this.form.get('contraseña')?.setValidators(Validators.required);
      this.form.get('contraseña')?.updateValueAndValidity();
    }
  }

  loadUser(id: string) {
    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (user: any) => {
        this.form.patchValue({
          nombreCompleto: user.nombreCompleto,
          usuario: user.usuario,
          correo: user.correo,
          rol: user.rol,
          estado: user.estado
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando usuario', error);
        this.loading = false;
        alert('Error al cargar usuario');
        this.router.navigate(['/admin/usuarios']);
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.form.getRawValue();

    if (this.isEditMode) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        const updateData = {
          nombreCompleto: formData.nombreCompleto,
          correo: formData.correo,
          rol: Number(formData.rol),
          estado: Number(formData.estado)
        };

        this.userService.update(id, updateData as any).pipe(first()).subscribe({
          next: () => {
            this.router.navigate(['/admin/usuarios']);
          },
          error: (error) => {
            console.error('Error actualizando usuario', error);
            this.loading = false;
            alert('Error al actualizar usuario');
          }
        });
      }
    } else {
      const createData = {
        nombreCompleto: formData.nombreCompleto,
        usuario: formData.usuario,
        correo: formData.correo,
        contraseña: formData.contraseña,
        rol: Number(formData.rol)
      };

      this.userService.create(createData as any).pipe(first()).subscribe({
        next: () => {
          this.router.navigate(['/admin/usuarios']);
        },
        error: (error) => {
          console.error('Error creando usuario', error);
          this.loading = false;
          alert('Error al crear usuario');
        }
      });
    }
  }
}
