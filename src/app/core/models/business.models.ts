export interface Producto {
    idProducto: string;
    idTienda: string;
    idCategoria?: string;
    codigoProducto?: string;
    nombreProducto: string;
    descripcion?: string;
    precioVenta: number;
    precioCompra?: number;
    stockActual: number;
    stockMinimo: number;
    unidadMedida: string;
    estado: string;
}

export interface Venta {
    idVenta: string;
    idTienda: string;
    nombreTienda: string;
    idUsuario: string;
    nombreUsuario: string;
    fechaVenta: string;
    totalVenta: number;
    metodoPago?: string;
    observaciones?: string;
    estado: string;
    detalles?: DetalleVenta[];
}

export interface DetalleVenta {
    idDetalleVenta: string;
    idVenta: string;
    idProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    nombreProducto?: string;
}

export interface Compra {
    idCompra: string;
    idTienda: string;
    nombreTienda: string;
    idProveedor?: string;
    nombreProveedor?: string;
    idUsuario: string;
    nombreUsuario: string;
    numeroFactura?: string;
    fechaCompra: string;
    totalCompra: number;
    observaciones?: string;
    estado: string;
    puedeEditar: boolean;
    fechaLimiteEdicion?: string;
    detalles?: DetalleCompra[];
}

export interface DetalleCompra {
    idDetalleCompra: string;
    idCompra: string;
    idProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    nombreProducto?: string;
}

export interface Reporte {
    ventasTotales: number;
    comprasTotales: number;
    ganancia: number;
    productosVendidos: number;
    ventasPorDia: VentaDia[];
}

export interface VentaDia {
    fecha: string;
    total: number;
}
