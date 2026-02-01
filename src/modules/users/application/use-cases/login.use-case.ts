import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../ports/user.repository.port';
import { IPasswordHasher, PASSWORD_HASHER } from '../../../../common/contracts/password-hasher.contract';
import { InvalidCredentialsException } from '../../../../common/exceptions/invalid-credentials.exception';
import { ILoggerFactory, LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface LoginResult {
  access_token: string;
  expires_in: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

@Injectable()
export class LoginUseCase {
  private readonly logger: ReturnType<ILoggerFactory['create']>;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(LOGGER_FACTORY)
    private readonly loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.create(LoginUseCase.name);
  }

  async execute(input: LoginInput): Promise<{ payload: JwtPayload; user: LoginResult['user'] }> {
    this.logger.debug(`Login: email=${input.email}`);

    const user = await this.userRepository.findByEmail(input.email.trim().toLowerCase());
    if (!user) {
      this.logger.warn(`Login fallido: usuario no encontrado (${input.email})`);
      throw new InvalidCredentialsException();
    }

    const valid = await this.passwordHasher.compare(input.password, user.passwordHash);
    if (!valid) {
      this.logger.warn(`Login fallido: contraseña incorrecta (${input.email})`);
      throw new InvalidCredentialsException();
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role.code,
    };

    this.logger.log(`Login exitoso: id=${user.id}, email=${user.email}`);
    return {
      payload,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.code,
      },
    };
  }
}
