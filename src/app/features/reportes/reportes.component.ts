import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../core/services';
import { Reporte } from '../../core/models/business.models';

@Component({
    selector: 'app-reportes',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './reportes.component.html',
    styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
    reporte?: Reporte;
    loading = false;
    error = '';

    constructor(private reporteService: ReporteService) { }

    ngOnInit() {
        this.loadReporte();
    }

    loadReporte() {
        this.loading = true;
        this.reporteService.getResumen().subscribe({
            next: (data) => {
                this.reporte = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Error al cargar reporte';
                this.loading = false;
            }
        });
    }
}
