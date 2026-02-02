import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER } from '@nestjs/core';
import { join } from 'path';
import { UsersModule } from '../../users.module';
import { HealthTypeormModule } from '../../../../common/health/health.typeorm.module';
import { JwtStrategy } from '../../../../common/auth/jwt.strategy';
import { UserSchema } from '../persistence/typeorm/user-schema.entity';
import { RoleSchema } from '../persistence/typeorm/role-schema.entity';
import { StateUserSchema } from '../persistence/typeorm/state-user-schema.entity';
import { PackageSchema } from '../../../packages/infrastructure/persistence/typeorm/package-schema.entity';
import { StatePackageSchema } from '../../../packages/infrastructure/persistence/typeorm/state-package-schema.entity';
import { configuration, validationSchema } from '../../../../config/configuration';
import { LOGGER_FACTORY } from '../../../../common/contracts/logger.contract';
import { LoggerFactoryAdapter } from '../../../../common/adapters/logger/logger-factory.adapter';
import { DomainExceptionFilter } from '../../../../common/filters/domain-exception.filter';

/**
 * Módulo raíz de la aplicación users-api.
 * Configura infraestructura (DB, Config) e importa UsersModule.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: { allowUnknown: true },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        entities: [UserSchema, RoleSchema, StateUserSchema, PackageSchema, StatePackageSchema],
        migrations: [join(__dirname, '../../../../database/migrations/*.js')],
        migrationsRun: config.get<boolean>('database.migrationsRun'),
        synchronize: false,
        logging: config.get<boolean>('database.logging'),
      }),
      inject: [ConfigService],
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
    UsersModule,
    HealthTypeormModule,
  ],
  providers: [
    JwtStrategy,
    { provide: LOGGER_FACTORY, useClass: LoggerFactoryAdapter },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
})
export class UsersAppModule {}
