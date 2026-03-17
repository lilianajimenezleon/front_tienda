import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tienda {
    idTienda: string;
    nombreTienda: string;
    direccion: string;
    telefono: string;
    email: string;
    fechaCreacion: Date;
    activo: boolean;
}

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TiendaService {
    private apiUrl = `${environment.apiUrl}/tiendas`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Tienda[]> {
        return this.http.get<Tienda[]>(this.apiUrl);
    }

    getById(id: string): Observable<Tienda> {
        return this.http.get<Tienda>(`${this.apiUrl}/${id}`);
    }

    create(tienda: Tienda): Observable<Tienda> {
        return this.http.post<Tienda>(this.apiUrl, tienda);
    }

    update(id: string, tienda: Tienda): Observable<Tienda> {
        return this.http.put<Tienda>(`${this.apiUrl}/${id}`, tienda);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
