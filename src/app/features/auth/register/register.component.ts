import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div class="card shadow-lg p-4" style="width: 100%; max-width: 600px;">
        <div class="card-body">
          <h3 class="card-title text-center mb-4 text-primary">
            <i class="bi bi-shop me-2"></i>Tienda App
          </h3>
          <h5 class="text-center mb-4 text-muted">Registrar Nueva Tienda</h5>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <!-- Información del Usuario -->
            <div class="mb-3">
              <h6 class="text-primary"><i class="bi bi-person me-2"></i>Información del Dueño</h6>
            </div>

            <div class="mb-3">
              <label class="form-label">Nombre Completo *</label>
              <input type="text" formControlName="nombreCompleto" class="form-control"
                [ngClass]="{ 'is-invalid': submitted && f['nombreCompleto'].errors }">
              <div *ngIf="submitted && f['nombreCompleto'].errors" class="invalid-feedback">
                El nombre completo es requerido
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Usuario *</label>
                <input type="text" formControlName="usuario" class="form-control"
                  [ngClass]="{ 'is-invalid': submitted && f['usuario'].errors }">
                <div *ngIf="submitted && f['usuario'].errors" class="invalid-feedback">
                  El usuario es requerido
                </div>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Correo *</label>
                <input type="email" formControlName="correo" class="form-control"
                  [ngClass]="{ 'is-invalid': submitted && f['correo'].errors }">
                <div *ngIf="submitted && f['correo'].errors" class="invalid-feedback">
                  <div *ngIf="f['correo'].errors['required']">El correo es requerido</div>
                  <div *ngIf="f['correo'].errors['email']">Correo inválido</div>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Contraseña *</label>
              <input type="password" formControlName="contraseña" class="form-control"
                [ngClass]="{ 'is-invalid': submitted && f['contraseña'].errors }">
              <div *ngIf="submitted && f['contraseña'].errors" class="invalid-feedback">
                La contraseña debe tener al menos 6 caracteres
              </div>
            </div>

            <!-- Información de la Tienda -->
            <div class="mb-3 mt-4">
              <h6 class="text-primary"><i class="bi bi-shop me-2"></i>Información de la Tienda</h6>
            </div>

            <div class="mb-3">
              <label class="form-label">Nombre de la Tienda *</label>
              <input type="text" formControlName="nombreTienda" class="form-control"
                [ngClass]="{ 'is-invalid': submitted && f['nombreTienda'].errors }">
              <div *ngIf="submitted && f['nombreTienda'].errors" class="invalid-feedback">
                El nombre de la tienda es requerido
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Teléfono</label>
                <input type="text" formControlName="telefono" class="form-control">
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">NIT</label>
                <input type="text" formControlName="nit" class="form-control">
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Dirección</label>
              <input type="text" formControlName="direccion" class="form-control">
            </div>

            <div class="mb-3">
              <label class="form-label">Correo de la Tienda</label>
              <input type="email" formControlName="correoTienda" class="form-control">
            </div>

            <div *ngIf="error" class="alert alert-danger">{{error}}</div>
            <div *ngIf="success" class="alert alert-success">{{success}}</div>

            <div class="d-grid gap-2 mt-4">
              <button [disabled]="loading" class="btn btn-primary btn-lg" type="submit">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                Registrar Tienda
              </button>
              <a routerLink="/login" class="btn btn-outline-secondary">
                Ya tengo cuenta - Iniciar Sesión
              </a>
            </div>
          </form>
        </div>
        <div class="card-footer text-center bg-white border-0 mt-3">
          <small class="text-muted">Sistema de Inventario v1.0</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 {
      min-height: 100vh;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nombreCompleto: ['', Validators.required],
      usuario: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      nombreTienda: ['', Validators.required],
      telefono: [''],
      nit: [''],
      direccion: [''],
      correoTienda: ['', Validators.email]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const usuarioData = {
      nombreCompleto: this.registerForm.value.nombreCompleto,
      usuario: this.registerForm.value.usuario,
      correo: this.registerForm.value.correo,
      contraseña: this.registerForm.value.contraseña,
      rol: 1
    };

    this.http.post<any>(`${environment.apiUrl}/auth/registro`, usuarioData)
      .pipe(first())
      .subscribe({
        next: (usuarioResponse) => {
          const tiendaData = {
            nombreTienda: this.registerForm.value.nombreTienda,
            direccion: this.registerForm.value.direccion,
            telefono: this.registerForm.value.telefono,
            correoTienda: this.registerForm.value.correoTienda,
            nit: this.registerForm.value.nit,
            idDueño: usuarioResponse.idUsuario
          };

          this.http.post(`${environment.apiUrl}/tiendas`, tiendaData)
            .pipe(first())
            .subscribe({
              next: () => {
                this.success = '¡Registro exitoso! Redirigiendo al login...';
                setTimeout(() => {
                  this.router.navigate(['/login']);
                }, 2000);
              },
              error: (error) => {
                console.error('Error creando tienda:', error);
                this.error = 'Error al crear la tienda. Contacte al administrador.';
                this.loading = false;
              }
            });
        },
        error: (error) => {
          console.error('Error registrando usuario:', error);
          if (error.error && typeof error.error === 'string') {
            this.error = error.error;
          } else {
            this.error = 'El nombre de usuario o correo ya están en uso. Por favor intente con otros datos.';
          }
          this.loading = false;
        }
      });
  }
}
