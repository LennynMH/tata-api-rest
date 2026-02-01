import { DomainException } from './domain.exception';
import { ESTADO_PAQUETE_INVALIDO } from '../constants/error.constants';

export class InvalidStatePackageException extends DomainException {
  constructor(code: string) {
    super({
      code: ESTADO_PAQUETE_INVALIDO.code,
      message: `${ESTADO_PAQUETE_INVALIDO.message}: ${code}`,
      details: [code],
    });
    this.name = 'InvalidStatePackageException';
    Object.setPrototypeOf(this, InvalidStatePackageException.prototype);
  }
}
