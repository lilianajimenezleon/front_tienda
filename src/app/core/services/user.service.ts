import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/auth.models';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/usuarios`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    getById(id: string): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
    }

    create(user: Usuario): Observable<Usuario> {
        return this.http.post<Usuario>(this.apiUrl, user);
    }

    update(id: string, user: Usuario): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/${id}`, user);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    resetPassword(id: string, nuevaContrasena: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/restablecer-contrasena`, { nuevaContraseña: nuevaContrasena });
    }
}
