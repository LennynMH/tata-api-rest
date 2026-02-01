import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UserResponseDto } from './dto/response/user-response.dto';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';

/**
 * Adaptador HTTP (puerto de entrada)
 * HU-01: Como administrador, quiero crear nuevos usuarios
 * HU-02: Como administrador o usuario, quiero consultar datos de un usuario
 */
@ApiTags('users')
@Controller('users')
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
  @ApiOperation({ summary: 'Crear usuario (HU-01)' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  async create(@Body() dto: CreateUserDto) {
    this.logger.log(`POST /users - request: email=${dto.email}, role_cod=${dto.role_cod ?? 'USU'}`);
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
  @ApiOperation({ summary: 'Consultar usuario por ID (HU-02)' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findById(@Param('id') id: string) {
    this.logger.log(`GET /users/${id}`);
    const user = await this.getUserUseCase.execute(id);
    this.logger.log(`GET /users/${id} - found: email=${user.email}`);
    return UserResponseDto.fromDomain(user);
  }
}
