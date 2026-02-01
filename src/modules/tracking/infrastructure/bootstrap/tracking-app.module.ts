import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { configuration, validationSchema } from '../../../../config/configuration';
import { TrackingModule } from '../../tracking.module';
import { SharedInfraModule } from '../../../../common/infrastructure/shared-infra.module';
import { HealthModule } from '../../../../common/health/health.module';
import { DomainExceptionFilter } from '../../../../common/filters/domain-exception.filter';

/**
 * Módulo raíz de tracking-api (puerto 2003)
 * Microservicio de seguimiento de paquetes con MongoDB
 */
@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: { allowUnknown: true },
    }),

    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.uri'),
      }),
      inject: [ConfigService],
    }),

    // Módulos compartidos
    SharedInfraModule,
    HealthModule,

    // Módulo principal
    TrackingModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
})
export class TrackingAppModule {}
