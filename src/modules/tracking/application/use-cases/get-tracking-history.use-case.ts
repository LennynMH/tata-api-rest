import { Inject, Injectable } from '@nestjs/common';
import { TrackingEvent } from '../../domain/entities/tracking-event.entity';
import {
  ITrackingEventRepository,
  TRACKING_EVENT_REPOSITORY,
} from '../ports/tracking-event.repository.port';
import { IPackageFinder, PACKAGE_FINDER } from '../../../../common/contracts/package-finder.contract';
import { PackageNotFoundException } from '../../../../common/exceptions/package-not-found.exception';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';

@Injectable()
export class GetTrackingHistoryUseCase {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    @Inject(TRACKING_EVENT_REPOSITORY)
    private readonly trackingEventRepository: ITrackingEventRepository,
    @Inject(PACKAGE_FINDER)
    private readonly packageFinder: IPackageFinder,
    @Inject(LOGGER_FACTORY)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(GetTrackingHistoryUseCase.name);
  }

  async execute(packageId: string): Promise<TrackingEvent[]> {
    this.logger.log(`Consultando historial de seguimiento para paquete ${packageId}`);

    // Validar que el paquete existe
    const packageExists = await this.packageFinder.existsById(packageId);
    if (!packageExists) {
      this.logger.warn(`Paquete no encontrado: ${packageId}`);
      throw new PackageNotFoundException(packageId);
    }

    // Obtener historial de eventos
    const events = await this.trackingEventRepository.findByPackageId(packageId);
    this.logger.log(`Historial obtenido: ${events.length} eventos`);

    return events;
  }
}
