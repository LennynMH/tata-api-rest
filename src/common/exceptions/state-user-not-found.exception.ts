import { DomainException } from './domain.exception';
import { ESTADO_USUARIO_NO_ENCONTRADO } from '../constants/error.constants';

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
