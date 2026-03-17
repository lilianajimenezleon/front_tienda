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
    nombreCategoria?: string;
    estado: string;
}

export interface CrearProducto {
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
}

export interface ActualizarProducto {
    nombreProducto?: string;
    descripcion?: string;
    precioVenta?: number;
    precioCompra?: number;
    stockMinimo?: number;
    idCategoria?: string;
}
