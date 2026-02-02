import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterTrackingEventUseCase } from '../../application/use-cases/register-tracking-event.use-case';
import { GetTrackingHistoryUseCase } from '../../application/use-cases/get-tracking-history.use-case';
import { RegisterTrackingEventDto } from './dto/request/register-tracking-event.dto';
import {
  TrackingEventResponseDto,
  TrackingHistoryResponseDto,
} from './dto/response/tracking-event-response.dto';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';
import { IPackageFinder, PACKAGE_FINDER } from '../../../../common/contracts/package-finder.contract';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { RequestUser } from '../../../../common/auth/jwt.strategy';
import { PackageNotFoundException } from '../../../../common/exceptions/package-not-found.exception';
import { ROLE_CODE_ADM } from '../../../../common/constants/role.constants';
import { AUTHORIZATION_HEADER } from '../../../../common/constants/http.constants';

@ApiTags('tracking')
@ApiBearerAuth('JWT')
@Controller('packages/:packageId/tracking-events')
@UseGuards(JwtAuthGuard)
export class TrackingController {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    private readonly registerTrackingEventUseCase: RegisterTrackingEventUseCase,
    private readonly getTrackingHistoryUseCase: GetTrackingHistoryUseCase,
    @Inject(PACKAGE_FINDER) private readonly packageFinder: IPackageFinder,
    @Inject(LOGGER_FACTORY) private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(TrackingController.name);
  }

  private async verifyPackageOwnership(
    packageId: string,
    authHeader: string,
    user: RequestUser,
  ): Promise<void> {
    const result = await this.packageFinder.getPackageOwnerId(packageId, authHeader);
    if ('status' in result) {
      if (result.status === 404) {
        throw new PackageNotFoundException(packageId);
      }
      if (result.status === 403) {
        throw new ForbiddenException('No tiene permiso para acceder a este paquete');
      }
    }
    if ('ownerId' in result && result.ownerId !== user.id && user.role !== ROLE_CODE_ADM) {
      throw new ForbiddenException('No tiene permiso para acceder a este paquete');
    }
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
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permiso para este paquete' })
  @ApiResponse({ status: 404, description: 'Paquete no encontrado (PKG001)' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async registerEvent(
    @Req() req: { user: RequestUser },
    @Headers(AUTHORIZATION_HEADER) authHeader: string,
    @Param('packageId') packageId: string,
    @Body() dto: RegisterTrackingEventDto,
  ): Promise<TrackingEventResponseDto> {
    await this.verifyPackageOwnership(packageId, authHeader ?? '', req.user);
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
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permiso para este paquete' })
  @ApiResponse({ status: 404, description: 'Paquete no encontrado (PKG001)' })
  async getHistory(
    @Req() req: { user: RequestUser },
    @Headers(AUTHORIZATION_HEADER) authHeader: string,
    @Param('packageId') packageId: string,
  ): Promise<TrackingHistoryResponseDto> {
    await this.verifyPackageOwnership(packageId, authHeader ?? '', req.user);
    this.logger.log(`GET /packages/${packageId}/tracking-events`);

    const events = await this.getTrackingHistoryUseCase.execute(packageId);

    this.logger.log(`Historial obtenido: ${events.length} eventos`);
    return TrackingHistoryResponseDto.fromDomain(packageId, events);
  }
}
