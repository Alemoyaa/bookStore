export interface Roles{
    editor?: boolean;
    admin?: boolean;
}
export interface userInterface {
    id?: string; // signo ? hace referencia a que no es obligatorio
    name?: string;
    email?: string;
    password?: string;
    photoUrl?: string;
    roles: Roles;
}
