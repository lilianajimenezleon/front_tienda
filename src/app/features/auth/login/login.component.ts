import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    weather: any = null;
    weatherError = false;
    ciudad = 'Bogota';
    ciudades = [
        'Bogota', 'Medellin', 'Cali', 'Barranquilla', 'Cartagena',
        'Bucaramanga', 'Pereira', 'Manizales', 'Ibague', 'Cucuta',
        'Santa Marta', 'Villavicencio', 'Armenia', 'Neiva', 'Popayan',
        'Sincelejo', 'Monteria', 'Valledupar', 'Pasto', 'Tunja'
    ];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private http: HttpClient
    ) {
        // redirect to home if already logged in
        if (this.authService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            usuario: ['', Validators.required],
            contraseña: ['', Validators.required]
        });
        this.ciudad = localStorage.getItem('weather_city') || 'Bogota';
        this.cargarClima();
    }

    cargarClima() {
        this.http.get<any>(`https://wttr.in/${this.ciudad}?format=j1&lang=es`).subscribe({
            next: (data) => { this.weather = data; },
            error: () => { this.weatherError = true; }
        });
    }

    iconoClima(): string {
        const code = this.weather?.current_condition?.[0]?.weatherCode;
        if (!code) return '';
        if (code == 113) return '☀️';
        if (code == 116) return '⛅';
        if ([119, 122].includes(code)) return '☁️';
        if ([143, 248, 260].includes(code)) return '🌫️';
        if ([176, 263, 266, 293].includes(code)) return '🌦️';
        if ([296, 299, 302, 305, 308].includes(code)) return '🌧️';
        if ([353, 356, 359].includes(code)) return '🌧️';
        if ([200, 386, 389, 392, 395].includes(code)) return '⛈️';
        if ([179, 182, 185, 227, 230, 311, 314, 317, 320, 323, 326, 329, 332, 335, 338, 350, 362, 365, 368, 371, 374, 377].includes(code)) return '🌨️';
        return '🌡️';
    }

    cambiarCiudad(event: Event) {
        const select = event.target as HTMLSelectElement;
        const nueva = select.value;
        if (!nueva) return;
        this.ciudad = nueva;
        localStorage.setItem('weather_city', this.ciudad);
        this.cargarClima();
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.error = ''; // Limpiar errores previos

        this.authService.login(this.loginForm.value)
            .pipe(first())
            .subscribe({
                next: (response) => {
                    // Redirigir según el rol del usuario
                    if (this.authService.isSystemAdmin()) {
                        // Administradores del sistema van al panel de administración
                        this.router.navigate(['/admin/dashboard']);
                    } else {
                        // Usuarios normales van al sistema regular
                        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                        this.router.navigate([returnUrl]);
                    }
                },
                error: error => {
                    console.error('Error de login:', error);

                    // Manejo específico de errores
                    if (error.status === 0) {
                        this.error = 'No se puede conectar al servidor. El servidor puede estar iniciándose (esto puede tardar hasta 60 segundos en el plan gratuito). Por favor, intente nuevamente.';
                    } else if (error.status === 401) {
                        this.error = 'Usuario o contraseña incorrectos';
                    } else if (error.status === 404) {
                        this.error = 'Servicio no disponible. Verifique que el backend esté funcionando.';
                    } else {
                        this.error = error.error?.message || error.message || 'Error de autenticación. Por favor, intente nuevamente.';
                    }

                    this.loading = false;
                }
            });
    }
}
