import { DomainException } from './domain.exception';
import { CREDENCIALES_INVALIDAS } from '../constants/error.constants';

export class InvalidCredentialsException extends DomainException {
  constructor() {
    super({
      code: CREDENCIALES_INVALIDAS.code,
      message: CREDENCIALES_INVALIDAS.message,
    });
    this.name = 'InvalidCredentialsException';
    Object.setPrototypeOf(this, InvalidCredentialsException.prototype);
  }
}
