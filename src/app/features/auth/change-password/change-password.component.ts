import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow border-0">
          <div class="card-header bg-white py-3">
            <h5 class="mb-0"><i class="bi bi-key me-2"></i>Cambiar Contraseña</h5>
          </div>
          <div class="card-body p-4">
            <div *ngIf="message" class="alert" [ngClass]="isError ? 'alert-danger' : 'alert-success'">
              {{ message }}
            </div>

            <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Contraseña Actual</label>
                <input type="password" class="form-control" formControlName="contraseñaActual" 
                       [ngClass]="{'is-invalid': f['contraseñaActual'].touched && f['contraseñaActual'].errors}">
                <div class="invalid-feedback">La contraseña actual es requerida</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Nueva Contraseña</label>
                <input type="password" class="form-control" formControlName="contraseñaNueva"
                       [ngClass]="{'is-invalid': f['contraseñaNueva'].touched && f['contraseñaNueva'].errors}">
                <div class="invalid-feedback">
                  <span *ngIf="f['contraseñaNueva'].errors?.['required']">La nueva contraseña es requerida</span>
                  <span *ngIf="f['contraseñaNueva'].errors?.['minlength']">Mínimo 8 caracteres</span>
                  <span *ngIf="f['contraseñaNueva'].errors?.['pattern']">Debe incluir mayúscula, número y carácter especial</span>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label">Confirmar Nueva Contraseña</label>
                <input type="password" class="form-control" formControlName="confirmarPassword"
                       [ngClass]="{'is-invalid': f['confirmarPassword'].touched && passwordForm.errors?.['mismatch']}">
                <div class="invalid-feedback">Las contraseñas no coinciden</div>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg" [disabled]="passwordForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                  Actualizar Contraseña
                </button>
                <button type="button" class="btn btn-light" (click)="goBack()">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  loading = false;
  message = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      contraseñaActual: ['', Validators.required],
      contraseñaNueva: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
      ]],
      confirmarPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get f() { return this.passwordForm.controls; }

  passwordMatchValidator(g: FormGroup) {
    return g.get('contraseñaNueva')?.value === g.get('confirmarPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.passwordForm.invalid) return;

    this.loading = true;
    this.message = '';
    
    const data = {
      contraseñaActual: this.passwordForm.value.contraseñaActual,
      contraseñaNueva: this.passwordForm.value.contraseñaNueva
    };

    this.authService.changePassword(data).subscribe({
      next: () => {
        this.loading = false;
        this.isError = false;
        this.message = 'Contraseña cambiada con éxito. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.isError = true;
        this.message = err.error?.message || 'Error al cambiar la contraseña. Verifica tu clave actual.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
