/**
 * Contrato compartido: obtener datos de usuario (para propietario de paquete).
 * packages-api (casos de uso) depende de este puerto; la implementación puede ser
 * LocalUserFinderAdapter (mismo proceso) o HttpUserApiAdapter (llamada a users-api).
 */
export const USER_FINDER = Symbol('USER_FINDER');

export interface UserFinderResult {
  id: string;
  email: string;
  name: string;
}

export interface IUserFinder {
  findById(id: string): Promise<UserFinderResult | null>;
}
