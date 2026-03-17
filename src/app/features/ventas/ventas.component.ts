import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VentaService } from '../../core/services';
import { Venta } from '../../core/models/business.models';

@Component({
    selector: 'app-ventas',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './ventas.component.html',
    styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
    ventas: Venta[] = [];
    loading = false;
    error = '';

    constructor(private ventaService: VentaService) { }

    ngOnInit() {
        this.loadVentas();
    }

    loadVentas() {
        this.loading = true;
        this.ventaService.getAll().subscribe({
            next: (data) => {
                this.ventas = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar ventas';
                this.loading = false;
            }
        });
    }
}
