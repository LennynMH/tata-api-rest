import { Body, Controller, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreatePackageUseCase } from '../../application/use-cases/create-package.use-case';
import { ListUserPackagesUseCase } from '../../application/use-cases/list-user-packages.use-case';
import { GetPackageByIdUseCase } from '../../application/use-cases/get-package-by-id.use-case';
import { UpdatePackageStatusUseCase } from '../../application/use-cases/update-package-status.use-case';
import { CreatePackageDto } from './dto/request/create-package.dto';
import { ListPackagesQueryDto } from './dto/request/list-packages-query.dto';
import { UpdatePackageStatusDto } from './dto/request/update-package-status.dto';
import { PackageResponseDto } from './dto/response/package-response.dto';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';

/**
 * Adaptador HTTP - Módulo packages
 * HU-03: Ver paquetes registrados del usuario
 * HU-04: Registrar nuevo paquete
 * HU-05: Consultar datos de un paquete
 * HU-06: Actualizar estado de paquete
 */
@ApiTags('packages')
@Controller('packages')
export class PackagesController {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    private readonly createPackageUseCase: CreatePackageUseCase,
    private readonly listUserPackagesUseCase: ListUserPackagesUseCase,
    private readonly getPackageByIdUseCase: GetPackageByIdUseCase,
    private readonly updatePackageStatusUseCase: UpdatePackageStatusUseCase,
    @Inject(LOGGER_FACTORY) private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(PackagesController.name);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar paquete (HU-04)' })
  @ApiResponse({ status: 201, description: 'Paquete creado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'Número de seguimiento duplicado' })
  async create(@Body() dto: CreatePackageDto) {
    this.logger.log(`POST /packages - user_id=${dto.user_id}, tracking=${dto.tracking_number}`);
    const pkg = await this.createPackageUseCase.execute({
      userId: dto.user_id,
      trackingNumber: dto.tracking_number,
      origin: dto.origin,
      destination: dto.destination,
      status: dto.status,
    });
    this.logger.log(`POST /packages - created id=${pkg.id}`);
    return PackageResponseDto.fromDomain(pkg);
  }

  @Get()
  @ApiOperation({ summary: 'Listar paquetes del usuario (HU-03)' })
  @ApiQuery({ name: 'user_id', required: true, description: 'UUID del usuario propietario' })
  @ApiResponse({ status: 200, description: 'Lista de paquetes del usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async listByUser(@Query() query: ListPackagesQueryDto) {
    const userId = query.user_id;
    this.logger.log(`GET /packages?user_id=${userId}`);
    const packages = await this.listUserPackagesUseCase.execute(userId);
    return packages.map((p) => PackageResponseDto.fromDomain(p));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar paquete por ID (HU-05)' })
  @ApiParam({ name: 'id', description: 'UUID del paquete' })
  @ApiResponse({ status: 200, description: 'Paquete encontrado' })
  @ApiResponse({ status: 404, description: 'Paquete no encontrado' })
  async findById(@Param('id') id: string) {
    this.logger.log(`GET /packages/${id}`);
    const pkg = await this.getPackageByIdUseCase.execute(id);
    return PackageResponseDto.fromDomain(pkg);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar estado de paquete (HU-06)' })
  @ApiParam({ name: 'id', description: 'UUID del paquete' })
  @ApiResponse({ status: 200, description: 'Estado actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  @ApiResponse({ status: 404, description: 'Paquete no encontrado' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdatePackageStatusDto) {
    this.logger.log(`PATCH /packages/${id} - status=${dto.status}`);
    const pkg = await this.updatePackageStatusUseCase.execute({
      packageId: id,
      status: dto.status,
    });
    this.logger.log(`PATCH /packages/${id} - updated to ${pkg.statePackage.code}`);
    return PackageResponseDto.fromDomain(pkg);
  }
}
