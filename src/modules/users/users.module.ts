import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { ROLE_REPOSITORY } from './application/ports/role.repository.port';
import { STATE_USER_REPOSITORY } from './application/ports/state-user.repository.port';
import { PASSWORD_HASHER } from '../../common/contracts/password-hasher.contract';
import { LOGGER_FACTORY } from '../../common/contracts/logger.contract';
import { LoggerFactoryAdapter } from '../../common/adapters/logger/logger-factory.adapter';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { UserSchema } from './infrastructure/persistence/typeorm/user-schema.entity';
import { RoleSchema } from './infrastructure/persistence/typeorm/role-schema.entity';
import { StateUserSchema } from './infrastructure/persistence/typeorm/state-user-schema.entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm/typeorm-user.repository';
import { TypeOrmRoleRepository } from './infrastructure/persistence/typeorm/typeorm-role.repository';
import { TypeOrmStateUserRepository } from './infrastructure/persistence/typeorm/typeorm-state-user.repository';
import { SimplePasswordHasher } from '../../common/adapters/simple-password.hasher';
import { UsersController } from './infrastructure/http/users.controller';
import { AuthController } from './infrastructure/http/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema, RoleSchema, StateUserSchema]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
        signOptions: { expiresIn: config.get<string>('jwt.expiresIn') ?? '30m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    LoginUseCase,
    CreateUserUseCase,
    GetUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: ROLE_REPOSITORY,
      useClass: TypeOrmRoleRepository,
    },
    {
      provide: STATE_USER_REPOSITORY,
      useClass: TypeOrmStateUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: SimplePasswordHasher,
    },
    {
      provide: LOGGER_FACTORY,
      useClass: LoggerFactoryAdapter,
    },
  ],
  exports: [CreateUserUseCase, GetUserUseCase, LoginUseCase, USER_REPOSITORY],
})
export class UsersModule {}
