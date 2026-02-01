import { DomainException } from './domain.exception';
import { ROL_INVALIDO } from '../constants/error.constants';

export class InvalidRoleException extends DomainException {
  constructor(roleCode: string) {
    super({
      code: ROL_INVALIDO.code,
      message: `Rol con código '${roleCode}' no existe. ${ROL_INVALIDO.message}`,
      details: [roleCode],
    });
    this.name = 'InvalidRoleException';
    Object.setPrototypeOf(this, InvalidRoleException.prototype);
  }
}
