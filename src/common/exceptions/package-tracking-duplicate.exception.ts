import { DomainException } from './domain.exception';
import { PAQUETE_TRACKING_DUPLICADO } from '../constants/error.constants';

export class PackageTrackingDuplicateException extends DomainException {
  constructor(trackingNumber: string) {
    super({
      code: PAQUETE_TRACKING_DUPLICADO.code,
      message: `${PAQUETE_TRACKING_DUPLICADO.message}: '${trackingNumber}'`,
      details: [trackingNumber],
    });
    this.name = 'PackageTrackingDuplicateException';
    Object.setPrototypeOf(this, PackageTrackingDuplicateException.prototype);
  }
}
