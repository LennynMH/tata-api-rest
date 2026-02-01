import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { ROLE_REPOSITORY } from './application/ports/role.repository.port';
import { PASSWORD_HASHER } from '../../common/contracts/password-hasher.contract';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { UserSchema } from './infrastructure/persistence/typeorm/user-schema.entity';
import { RoleSchema } from './infrastructure/persistence/typeorm/role-schema.entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm/typeorm-user.repository';
import { TypeOrmRoleRepository } from './infrastructure/persistence/typeorm/typeorm-role.repository';
import { SimplePasswordHasher } from '../../common/adapters/password-hasher/simple-password.hasher';
import { UsersController } from './infrastructure/http/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema, RoleSchema])],
  controllers: [UsersController],
  providers: [
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
      provide: PASSWORD_HASHER,
      useClass: SimplePasswordHasher,
    },
  ],
  exports: [CreateUserUseCase, GetUserUseCase],
})
export class UsersModule {}
