import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Merma {
    idMerma: string;
    idTienda: string;
    idProducto: string;
    nombreProducto?: string;
    cantidad: number;
    motivo: string;
    descripcion?: string;
    fechaMerma: string;
    nombreTienda?: string;
}

export interface CrearMermaDto {
    idTienda: string;
    idProducto: string;
    cantidad: number;
    motivo: string;
    descripcion?: string;
}

@Injectable({ providedIn: 'root' })
export class MermaService {
    private apiUrl = `${environment.apiUrl}/mermas`;

    constructor(private http: HttpClient) { }

    getByTienda(idTienda: string): Observable<Merma[]> {
        return this.http.get<Merma[]>(`${this.apiUrl}/tienda/${idTienda}`);
    }

    create(dto: CrearMermaDto): Observable<Merma> {
        return this.http.post<Merma>(this.apiUrl, dto);
    }
}
