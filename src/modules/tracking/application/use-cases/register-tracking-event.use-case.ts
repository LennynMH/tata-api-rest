import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TrackingEvent, Location } from '../../domain/entities/tracking-event.entity';
import {
  ITrackingEventRepository,
  TRACKING_EVENT_REPOSITORY,
} from '../ports/tracking-event.repository.port';
import { IPackageFinder, PACKAGE_FINDER } from '../../../../common/contracts/package-finder.contract';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';

export interface RegisterTrackingEventInput {
  packageId: string;
  eventType: string;
  location: Location;
  status: string;
  description: string;
  eventDate?: Date;
  metadata?: Record<string, unknown>;
  createdBy?: string;
}

@Injectable()
export class RegisterTrackingEventUseCase {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    @Inject(TRACKING_EVENT_REPOSITORY)
    private readonly trackingEventRepository: ITrackingEventRepository,
    @Inject(LOGGER_FACTORY)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(RegisterTrackingEventUseCase.name);
  }

  async execute(input: RegisterTrackingEventInput): Promise<TrackingEvent> {
    this.logger.log(`Registrando evento de seguimiento para paquete ${input.packageId}`);

    // La verificación de existencia y propiedad del paquete se hace en el controller (getPackageOwnerId + JWT)
    // antes de invocar este use case.

    // Crear evento de seguimiento
    const event = TrackingEvent.create(
      uuidv4(),
      input.packageId,
      input.eventType,
      input.location,
      input.status,
      input.description,
      input.eventDate ?? new Date(),
      input.metadata,
      input.createdBy,
    );

    // Guardar en MongoDB
    const savedEvent = await this.trackingEventRepository.save(event);
    this.logger.log(`Evento de seguimiento registrado: ${savedEvent.id}`);

    return savedEvent;
  }
}
