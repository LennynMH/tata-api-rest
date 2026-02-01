import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RegisterTrackingEventUseCase } from '../../application/use-cases/register-tracking-event.use-case';
import { GetTrackingHistoryUseCase } from '../../application/use-cases/get-tracking-history.use-case';
import { RegisterTrackingEventDto } from './dto/request/register-tracking-event.dto';
import {
  TrackingEventResponseDto,
  TrackingHistoryResponseDto,
} from './dto/response/tracking-event-response.dto';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';

/**
 * Adaptador HTTP (puerto de entrada)
 * HU-07: Registrar eventos de seguimiento de un paquete
 * HU-08: Consultar historial completo de un paquete
 */
@ApiTags('tracking')
@Controller('packages/:packageId/tracking-events')
export class TrackingController {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    private readonly registerTrackingEventUseCase: RegisterTrackingEventUseCase,
    private readonly getTrackingHistoryUseCase: GetTrackingHistoryUseCase,
    @Inject(LOGGER_FACTORY) private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(TrackingController.name);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar evento de seguimiento (HU-07)' })
  @ApiParam({
    name: 'packageId',
    description: 'UUID del paquete',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Evento registrado correctamente',
    type: TrackingEventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Paquete no encontrado (PKG001)' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async registerEvent(
    @Param('packageId') packageId: string,
    @Body() dto: RegisterTrackingEventDto,
  ): Promise<TrackingEventResponseDto> {
    this.logger.log(`POST /packages/${packageId}/tracking-events`);

    const event = await this.registerTrackingEventUseCase.execute({
      packageId,
      eventType: dto.event_type,
      location: {
        address: dto.location.address,
        coordinates: dto.location.coordinates,
      },
      status: dto.status,
      description: dto.description,
      eventDate: dto.event_date ? new Date(dto.event_date) : undefined,
      metadata: dto.metadata,
      createdBy: dto.created_by,
    });

    this.logger.log(`Evento registrado: ${event.id}`);
    return TrackingEventResponseDto.fromDomain(event);
  }

  @Get()
  @ApiOperation({ summary: 'Consultar historial de seguimiento (HU-08)' })
  @ApiParam({
    name: 'packageId',
    description: 'UUID del paquete',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial de eventos del paquete',
    type: TrackingHistoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Paquete no encontrado (PKG001)' })
  async getHistory(
    @Param('packageId') packageId: string,
  ): Promise<TrackingHistoryResponseDto> {
    this.logger.log(`GET /packages/${packageId}/tracking-events`);

    const events = await this.getTrackingHistoryUseCase.execute(packageId);

    this.logger.log(`Historial obtenido: ${events.length} eventos`);
    return TrackingHistoryResponseDto.fromDomain(packageId, events);
  }
}
