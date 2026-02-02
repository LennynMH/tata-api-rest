import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePackageUseCase } from '../../application/use-cases/create-package.use-case';
import { ListUserPackagesUseCase } from '../../application/use-cases/list-user-packages.use-case';
import { GetPackageByIdUseCase } from '../../application/use-cases/get-package-by-id.use-case';
import { UpdatePackageStatusUseCase } from '../../application/use-cases/update-package-status.use-case';
import { CreatePackageDto } from './dto/request/create-package.dto';
import { UpdatePackageStatusDto } from './dto/request/update-package-status.dto';
import { PackageResponseDto } from './dto/response/package-response.dto';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { RequestUser } from '../../../../common/auth/jwt.strategy';
import { ROLE_CODE_ADM } from '../../../../common/constants/role.constants';
import { AUTHORIZATION_HEADER } from '../../../../common/constants/http.constants';

@ApiTags('packages')
@ApiBearerAuth('JWT')
@Controller('packages')
@UseGuards(JwtAuthGuard)
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
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'Número de seguimiento duplicado' })
  async create(
    @Req() req: { user: RequestUser },
    @Headers(AUTHORIZATION_HEADER) authHeader: string,
    @Body() dto: CreatePackageDto,
  ) {
    const userId = req.user.id;
    this.logger.log(`POST /packages - user_id=${userId}, tracking=${dto.tracking_number}`);
    const pkg = await this.createPackageUseCase.execute({
      userId,
      trackingNumber: dto.tracking_number,
      origin: dto.origin,
      destination: dto.destination,
      status: dto.status,
      authHeader: authHeader ?? undefined,
    });
    this.logger.log(`POST /packages - created id=${pkg.id}`);
    return PackageResponseDto.fromDomain(pkg);
  }

  @Get()
  @ApiOperation({ summary: 'Listar paquetes del usuario (HU-03)' })
  @ApiResponse({ status: 200, description: 'Lista de paquetes del usuario autenticado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async listByUser(@Req() req: { user: RequestUser }, @Headers('authorization') authHeader: string) {
    const userId = req.user.id;
    this.logger.log(`GET /packages - user_id=${userId}`);
    const packages = await this.listUserPackagesUseCase.execute(userId, authHeader ?? undefined);
    return packages.map((p) => PackageResponseDto.fromDomain(p));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar paquete por ID (HU-05)' })
  @ApiParam({ name: 'id', description: 'UUID del paquete' })
  @ApiResponse({ status: 200, description: 'Paquete encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permiso para este paquete' })
  @ApiResponse({ status: 404, description: 'Paquete no encontrado' })
  async findById(@Req() req: { user: RequestUser }, @Param('id') id: string) {
    this.logger.log(`GET /packages/${id}`);
    const pkg = await this.getPackageByIdUseCase.execute(id);
    if (pkg.userId !== req.user.id && req.user.role !== ROLE_CODE_ADM) {
      throw new ForbiddenException('No tiene permiso para consultar este paquete');
    }
    return PackageResponseDto.fromDomain(pkg);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar estado de paquete (HU-06)' })
  @ApiParam({ name: 'id', description: 'UUID del paquete' })
  @ApiResponse({ status: 200, description: 'Estado actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Sin permiso para este paquete' })
  @ApiResponse({ status: 404, description: 'Paquete no encontrado' })
  async updateStatus(
    @Req() req: { user: RequestUser },
    @Param('id') id: string,
    @Body() dto: UpdatePackageStatusDto,
  ) {
    const pkg = await this.getPackageByIdUseCase.execute(id);
    if (pkg.userId !== req.user.id && req.user.role !== ROLE_CODE_ADM) {
      throw new ForbiddenException('No tiene permiso para actualizar este paquete');
    }
    this.logger.log(`PATCH /packages/${id} - status=${dto.status}`);
    const updated = await this.updatePackageStatusUseCase.execute({
      packageId: id,
      status: dto.status,
    });
    return PackageResponseDto.fromDomain(updated);
  }
}
