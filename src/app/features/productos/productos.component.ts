import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../core/services';
import { Producto } from '../../core/models/business.models';

@Component({
    selector: 'app-productos',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './productos.component.html',
    styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
    productos: Producto[] = [];
    loading = false;
    error = '';

    constructor(private productoService: ProductoService) { }

    ngOnInit() {
        this.loadProductos();
    }

    loadProductos() {
        this.loading = true;
        this.productoService.getAll().subscribe({
            next: (data) => {
                this.productos = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar productos';
                this.loading = false;
            }
        });
    }

    deleteProducto(id: string) {
        if (confirm('¿Está seguro de eliminar este producto?')) {
            this.productoService.delete(id).subscribe({
                next: () => this.loadProductos(),
                error: (err) => this.error = 'Error al eliminar producto'
            });
        }
    }
}
