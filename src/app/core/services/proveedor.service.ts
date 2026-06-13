import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Proveedor {
    idProveedor: string;
    idTienda: string;
    nombreProveedor: string;
    nit?: string;
    telefono?: string;
    correo?: string;
    direccion?: string;
    estado: number;
}

export interface CrearProveedorDto {
    idTienda: string;
    nombreProveedor: string;
    nit?: string;
    telefono?: string;
    correo?: string;
    direccion?: string;
}

@Injectable({ providedIn: 'root' })
export class ProveedorService {
    private apiUrl = `${environment.apiUrl}/proveedores`;

    constructor(private http: HttpClient) { }

    getByTienda(idTienda: string): Observable<Proveedor[]> {
        return this.http.get<Proveedor[]>(`${this.apiUrl}/tienda/${idTienda}`);
    }

    create(dto: CrearProveedorDto): Observable<Proveedor> {
        return this.http.post<Proveedor>(this.apiUrl, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
