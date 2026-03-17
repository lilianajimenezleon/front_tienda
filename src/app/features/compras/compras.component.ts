import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompraService } from '../../core/services';
import { Compra } from '../../core/models/business.models';

@Component({
    selector: 'app-compras',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './compras.component.html',
    styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {
    compras: Compra[] = [];
    loading = false;
    error = '';

    constructor(private compraService: CompraService) { }

    ngOnInit() {
        this.loadCompras();
    }

    loadCompras() {
        this.loading = true;
        this.compraService.getAll().subscribe({
            next: (data) => {
                this.compras = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar compras';
                this.loading = false;
            }
        });
    }
}

