import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/**
 * Módulo de health sin TypeORM (sin verificación de BD).
 * Usar en tracking-api o cualquier servicio que no use TypeORM.
 */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
