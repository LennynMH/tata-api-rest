import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';
import { JwtAuthGuard } from '../../../../common/auth/jwt-auth.guard';
import { RequestUser } from '../../../../common/auth/jwt.strategy';
import { ROLE_CODE_ADM, ROLE_CODE_USU } from '../../../../common/constants/role.constants';

@ApiTags('users')
@ApiBearerAuth('JWT')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    @Inject(LOGGER_FACTORY) private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(UsersController.name);
  }

  @Post()
  @ApiOperation({ summary: 'Crear usuario (HU-01) - solo ADM' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Solo administradores pueden crear usuarios' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  async create(@Req() req: { user: RequestUser }, @Body() dto: CreateUserDto) {
    if (req.user.role !== ROLE_CODE_ADM) {
      throw new ForbiddenException('Solo administradores pueden crear usuarios');
    }
    this.logger.log(`POST /users - request: email=${dto.email}, role_cod=${dto.role_cod ?? ROLE_CODE_USU}`);
    const user = await this.createUserUseCase.execute({
      email: dto.email,
      password: dto.password,
      name: dto.name,
      role_cod: dto.role_cod,
    });
    this.logger.log(`POST /users - response: id=${user.id}`);
    return UserResponseDto.fromDomain(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar usuario por ID (HU-02) - propio perfil o ADM' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'Solo puede consultar su propio perfil' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findById(@Req() req: { user: RequestUser }, @Param('id') id: string) {
    if (req.user.id !== id && req.user.role !== ROLE_CODE_ADM) {
      throw new ForbiddenException('Solo puede consultar su propio perfil');
    }
    this.logger.log(`GET /users/${id}`);
    const user = await this.getUserUseCase.execute(id);
    this.logger.log(`GET /users/${id} - found: email=${user.email}`);
    return UserResponseDto.fromDomain(user);
  }
}
