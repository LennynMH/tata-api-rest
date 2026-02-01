import { DomainException } from './domain.exception';
import { USUARIO_EMAIL_DUPLICADO } from '../constants/error.constants';

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super({
      code: USUARIO_EMAIL_DUPLICADO.code,
      message: `${USUARIO_EMAIL_DUPLICADO.message}: ${email}`,
      httpStatus: USUARIO_EMAIL_DUPLICADO.httpStatus,
      details: [email],
    });
    this.name = 'UserAlreadyExistsException';
    Object.setPrototypeOf(this, UserAlreadyExistsException.prototype);
  }
}
