import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER } from '@nestjs/core';
import { PackagesModule } from '../../packages.module';
import { HealthTypeormModule } from '../../../../common/health/health.typeorm.module';
import { SharedInfraModule } from '../../../../common/infrastructure/shared-infra.module';
import { JwtStrategy } from '../../../../common/auth/jwt.strategy';
import { UserSchema } from '../../../users/infrastructure/persistence/typeorm/user-schema.entity';
import { RoleSchema } from '../../../users/infrastructure/persistence/typeorm/role-schema.entity';
import { StateUserSchema } from '../../../users/infrastructure/persistence/typeorm/state-user-schema.entity';
import { PackageSchema } from '../persistence/typeorm/package-schema.entity';
import { StatePackageSchema } from '../persistence/typeorm/state-package-schema.entity';
import { configuration, validationSchema } from '../../../../config/configuration';
import { DomainExceptionFilter } from '../../../../common/filters/domain-exception.filter';

/**
 * Módulo raíz de la aplicación packages-api.
 * Configura infraestructura (DB, Config) e importa PackagesModule.
 * SharedInfraModule provee USER_FINDER via HTTP (HttpUserApiAdapter) para comunicarse con users-api.
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
        migrationsRun: false,
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
    SharedInfraModule,
    PackagesModule,
    HealthTypeormModule,
  ],
  providers: [
    JwtStrategy,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
})
export class PackagesAppModule {}
