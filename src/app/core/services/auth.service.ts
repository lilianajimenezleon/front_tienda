import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { LoginRequest, LoginResponse, Usuario } from '../models/auth.models';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUserSubject: BehaviorSubject<Usuario | null>;
    public currentUser: Observable<Usuario | null>;
    private isBrowser: boolean;

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        const storedUser = this.isBrowser ? localStorage.getItem('currentUser') : null;
        this.currentUserSubject = new BehaviorSubject<Usuario | null>(storedUser ? JSON.parse(storedUser) : null);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Usuario | null {
        return this.currentUserSubject.value;
    }

    public get token(): string | null {
        return this.isBrowser ? localStorage.getItem('token') : null;
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
            .pipe(map(response => {
                if (response && response.token && this.isBrowser) {
                    localStorage.setItem('token', response.token);

                    // Extraer el rol del token JWT en lugar del response
                    const rolFromToken = this.getRolFromToken(response.token);

                    const user: Usuario = {
                        idUsuario: response.idUsuario,
                        nombre: response.nombreCompleto.split(' ')[0] || '',
                        apellido: response.nombreCompleto.split(' ').slice(1).join(' ') || '',
                        email: response.correo,
                        telefono: '',
                        rol: rolFromToken || 'EMPLEADO', // Usar el rol del token
                        idTienda: response.idTienda || '',
                        activo: true,
                        nombreCompleto: response.nombreCompleto,
                        usuario: response.usuario,
                        correo: response.correo,
                        tiendas: response.idTienda ? [{ idTienda: response.idTienda }] : []
                    };

                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return response;
            }));
    }

    logout() {
        if (this.isBrowser) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
        }
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    getTiendaIdFromToken(): string | null {
        const token = this.token;
        if (!token) return null;

        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            const parsedPayload = JSON.parse(decodedPayload);
            return parsedPayload.IdTienda || null;
        } catch (e) {
            console.error('Error al decodificar token', e);
            return null;
        }
    }

    getRolFromToken(token: string): string | null {
        if (!token) return null;

        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            const parsedPayload = JSON.parse(decodedPayload);
            // El rol viene en el claim de Microsoft
            return parsedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
        } catch (e) {
            console.error('Error al decodificar token', e);
            return null;
        }
    }

    isAdmin(): boolean {
        return this.currentUserValue?.rol === 'Admin' || this.currentUserValue?.rol === 'ADMIN_SISTEMA';
    }

    isSystemAdmin(): boolean {
        return this.currentUserValue?.rol === 'ADMIN_SISTEMA';
    }

    isOwner(): boolean {
        return this.currentUserValue?.rol === 'DUEÑO_TIENDA';
    }

    isEmployee(): boolean {
        return this.currentUserValue?.rol === 'EMPLEADO';
    }

    hasFullAccess(): boolean {
        return this.isSystemAdmin();
    }

    changePassword(request: { contraseñaActual: string, contraseñaNueva: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/cambiar-password`, request);
    }
}
