import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginDto } from './dto/request/login.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(LOGGER_FACTORY) private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(AuthController.name);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión (HU-11)' })
  @ApiResponse({ status: 200, description: 'Login exitoso; devuelve access_token JWT' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas (USR005)' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (email o password)' })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    this.logger.log(`POST /auth/login - email=${dto.email}`);

    const { payload, user } = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    const expiresInSeconds = this.config.get<number>('jwt.expiresInSeconds');
    const expiresInMinutes = this.config.get<number>('jwt.expiresInMinutes');
    const access_token = this.jwtService.sign(payload, { expiresIn: expiresInSeconds });

    return {
      access_token,
      expires_in: `${expiresInMinutes}m`,
      token_type: 'Bearer',
      user,
    };
  }
}
