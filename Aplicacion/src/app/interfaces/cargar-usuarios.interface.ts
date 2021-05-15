import { Usuario } from '../models/usuarios.model';

export interface CargarUsuario {
    total: number;
    usuarios: Usuario[];
}