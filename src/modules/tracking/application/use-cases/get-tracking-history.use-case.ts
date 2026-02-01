import { Inject, Injectable } from '@nestjs/common';
import { TrackingEvent } from '../../domain/entities/tracking-event.entity';
import {
  ITrackingEventRepository,
  TRACKING_EVENT_REPOSITORY,
} from '../ports/tracking-event.repository.port';
import { IPackageFinder, PACKAGE_FINDER } from '../../../../common/contracts/package-finder.contract';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';

@Injectable()
export class GetTrackingHistoryUseCase {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    @Inject(TRACKING_EVENT_REPOSITORY)
    private readonly trackingEventRepository: ITrackingEventRepository,
    @Inject(LOGGER_FACTORY)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(GetTrackingHistoryUseCase.name);
  }

  async execute(packageId: string): Promise<TrackingEvent[]> {
    this.logger.log(`Consultando historial de seguimiento para paquete ${packageId}`);

    // La verificación de existencia y propiedad del paquete se hace en el controller (getPackageOwnerId + JWT)
    // antes de invocar este use case.

    // Obtener historial de eventos
    const events = await this.trackingEventRepository.findByPackageId(packageId);
    this.logger.log(`Historial obtenido: ${events.length} eventos`);

    return events;
  }
}
