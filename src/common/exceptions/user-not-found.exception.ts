import { DomainException } from './domain.exception';
import { USUARIO_NO_ENCONTRADO } from '../constants/error.constants';

export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    super({
      code: USUARIO_NO_ENCONTRADO.code,
      message: `${USUARIO_NO_ENCONTRADO.message} con id '${userId}'`,
      details: [userId],
    });
    this.name = 'UserNotFoundException';
    Object.setPrototypeOf(this, UserNotFoundException.prototype);
  }
}
