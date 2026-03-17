import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, CrearProducto, ActualizarProducto } from '../models/product.models';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/productos`;

    constructor(private http: HttpClient) { }

    getById(id: string): Observable<Producto> {
        return this.http.get<Producto>(`${this.apiUrl}/${id}`);
    }

    getByTienda(idTienda: string): Observable<Producto[]> {
        return this.http.get<Producto[]>(`${this.apiUrl}/tienda/${idTienda}`);
    }

    buscar(idTienda: string, termino: string): Observable<Producto[]> {
        return this.http.get<Producto[]>(`${this.apiUrl}/tienda/${idTienda}/buscar?termino=${termino}`);
    }

    getStockBajo(idTienda: string): Observable<Producto[]> {
        return this.http.get<Producto[]>(`${this.apiUrl}/tienda/${idTienda}/stock-bajo`);
    }

    create(producto: CrearProducto): Observable<Producto> {
        return this.http.post<Producto>(this.apiUrl, producto);
    }

    update(id: string, producto: ActualizarProducto): Observable<Producto> {
        return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
