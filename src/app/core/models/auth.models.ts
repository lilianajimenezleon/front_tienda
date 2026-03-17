export interface LoginRequest {
    usuario: string;
    contraseña: string;
}

export interface LoginResponse {
    idUsuario: string;
    nombreCompleto: string;
    usuario: string;
    correo: string;
    rol: string;
    token: string;
    expiracion: string;
    idTienda?: string;
}

export interface Usuario {
    idUsuario: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    rol: string;
    idTienda: string;
    activo: boolean;
    nombreCompleto?: string; // Para mantener compatibilidad con el código existente
    usuario?: string; // Para mantener compatibilidad con el código existente
    correo?: string; // Para mantener compatibilidad con el código existente
    tiendas?: { idTienda: string }[]; // Para mantener compatibilidad con el código existente
}

export interface ChangePasswordRequest {
    contraseñaActual: string;
    contraseñaNueva: string;
}
