import { DomainException } from './domain.exception';
import { ESTADO_USUARIO_NO_ENCONTRADO } from '../constants/error.constants';

/**
 * Excepción de dominio para estado de usuario no encontrado.
 * Se lanza cuando no se encuentra el estado de usuario por defecto en la BD.
 */
export class StateUserNotFoundException extends DomainException {
  constructor(stateCode: string) {
    super({
      code: ESTADO_USUARIO_NO_ENCONTRADO.code,
      message: `${ESTADO_USUARIO_NO_ENCONTRADO.message} con código '${stateCode}'`,
      details: [stateCode],
    });
    this.name = 'StateUserNotFoundException';
    Object.setPrototypeOf(this, StateUserNotFoundException.prototype);
  }
}
