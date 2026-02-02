import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as request from 'supertest';
import { configuration, validationSchema } from '../../../../src/config/configuration';
import { AuthController } from '../../../../src/modules/users/infrastructure/http/auth.controller';
import { UsersController } from '../../../../src/modules/users/infrastructure/http/users.controller';
import { LoginUseCase } from '../../../../src/modules/users/application/use-cases/login.use-case';
import { CreateUserUseCase } from '../../../../src/modules/users/application/use-cases/create-user.use-case';
import { GetUserUseCase } from '../../../../src/modules/users/application/use-cases/get-user.use-case';
import { USER_REPOSITORY } from '../../../../src/modules/users/application/ports/user.repository.port';
import { ROLE_REPOSITORY } from '../../../../src/modules/users/application/ports/role.repository.port';
import { STATE_USER_REPOSITORY } from '../../../../src/modules/users/application/ports/state-user.repository.port';
import { PASSWORD_HASHER } from '../../../../src/common/contracts/password-hasher.contract';
import { LOGGER_FACTORY } from '../../../../src/common/contracts/logger.contract';
import { SimplePasswordHasher } from '../../../../src/common/adapters/simple-password.hasher';
import { LoggerFactoryAdapter } from '../../../../src/common/adapters/logger/logger-factory.adapter';
import { JwtStrategy } from '../../../../src/common/auth/jwt.strategy';
import { DomainExceptionFilter } from '../../../../src/common/filters/domain-exception.filter';
import { MockUserRepository } from './mocks/MockUserRepository';
import { MockRoleRepository } from './mocks/MockRoleRepository';
import { MockStateUserRepository } from './mocks/MockStateUserRepository';
import { User } from '../../../../src/modules/users/domain/entities/user.entity';
import { Role } from '../../../../src/modules/users/domain/entities/role.entity';
import { StateUser } from '../../../../src/modules/users/domain/entities/state-user.entity';

export interface UsersTestApp {
  app: INestApplication;
  request: ReturnType<typeof request>;
  mockUserRepo: MockUserRepository;
  mockRoleRepo: MockRoleRepository;
  mockStateUserRepo: MockStateUserRepository;
}

export async function createUsersTestApp(): Promise<UsersTestApp> {
  const mockUserRepo = new MockUserRepository();
  const mockRoleRepo = new MockRoleRepository();
  const mockStateUserRepo = new MockStateUserRepository();

  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration],
        validationSchema,
        validationOptions: { allowUnknown: true },
      }),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          secret: config.get<string>('jwt.secret'),
          signOptions: { expiresIn: config.get<number>('jwt.expiresInSeconds') },
        }),
        inject: [ConfigService],
      }),
      PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [AuthController, UsersController],
    providers: [
      LoginUseCase,
      CreateUserUseCase,
      GetUserUseCase,
      JwtStrategy,
      { provide: USER_REPOSITORY, useValue: mockUserRepo },
      { provide: ROLE_REPOSITORY, useValue: mockRoleRepo },
      { provide: STATE_USER_REPOSITORY, useValue: mockStateUserRepo },
      { provide: PASSWORD_HASHER, useClass: SimplePasswordHasher },
      { provide: LOGGER_FACTORY, useClass: LoggerFactoryAdapter },
      { provide: APP_FILTER, useClass: DomainExceptionFilter },
    ],
  }).compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();

  return {
    app,
    request: request(app.getHttpServer()),
    mockUserRepo,
    mockRoleRepo,
    mockStateUserRepo,
  };
}

/** Hash compatible con SimplePasswordHasher (base64 del password). */
export function hashPassword(password: string): string {
  return Buffer.from(password, 'utf-8').toString('base64');
}

/** Crea Role para mocks. */
export function createRole(id: string, code: string, name: string): Role {
  return Role.create(id, code, name);
}

/** Crea StateUser para mocks. */
export function createStateUser(id: string, code: string, description: string): StateUser {
  return StateUser.create(id, code, description);
}

/** Crea User para mocks (passwordHash debe ser hashPassword('...') si usas SimplePasswordHasher). */
export function createUser(
  id: string,
  email: string,
  passwordHash: string,
  name: string,
  role: Role,
  state: StateUser,
  createdAt?: Date,
  updatedAt?: Date,
): User {
  const now = createdAt ?? new Date();
  return new User(id, email, passwordHash, name, role, state, now, updatedAt ?? now);
}
