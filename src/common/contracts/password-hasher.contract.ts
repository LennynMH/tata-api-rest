/**
 * Contrato compartido - Define la interfaz para hashear contraseñas
 * Usado por users (registro), auth (login), etc.
 */
export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
}
