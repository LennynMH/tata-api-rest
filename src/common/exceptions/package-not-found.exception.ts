import { DomainException } from './domain.exception';
import { PAQUETE_NO_ENCONTRADO } from '../constants/error.constants';

export class PackageNotFoundException extends DomainException {
  constructor(packageId: string) {
    super({
      code: PAQUETE_NO_ENCONTRADO.code,
      message: `${PAQUETE_NO_ENCONTRADO.message} con id '${packageId}'`,
      details: [packageId],
    });
    this.name = 'PackageNotFoundException';
    Object.setPrototypeOf(this, PackageNotFoundException.prototype);
  }
}
