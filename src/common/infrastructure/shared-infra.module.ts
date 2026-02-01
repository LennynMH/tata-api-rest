import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LOGGER_FACTORY } from '../contracts/logger.contract';
import { LoggerFactoryAdapter } from '../adapters/logger/logger-factory.adapter';
import { API_GATEWAY } from '../contracts/api-gateway.contract';
import { ApiGatewayAdapter } from '../adapters/api-gateway.adapter';
import { USER_FINDER } from '../contracts/user-finder.contract';
import { HttpUserApiAdapter } from '../adapters/http-user-api.adapter';

/**
 * Módulo de infraestructura compartida (Global).
 * Provee servicios de infraestructura disponibles en toda la aplicación:
 * - LOGGER_FACTORY: Fábrica de loggers
 * - API_GATEWAY: Cliente HTTP genérico
 * - USER_FINDER: Adaptador para buscar usuarios via HTTP (users-api)
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    { provide: LOGGER_FACTORY, useClass: LoggerFactoryAdapter },
    { provide: API_GATEWAY, useClass: ApiGatewayAdapter },
    { provide: USER_FINDER, useClass: HttpUserApiAdapter },
  ],
  exports: [LOGGER_FACTORY, API_GATEWAY, USER_FINDER],
})
export class SharedInfraModule {}
