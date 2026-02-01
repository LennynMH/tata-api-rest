import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthTypeormController } from './health.typeorm.controller';

/**
 * Módulo de health con TypeORM (PostgreSQL).
 * Usar en users-api y packages-api.
 */
@Module({
  imports: [TerminusModule],
  controllers: [HealthTypeormController],
})
export class HealthTypeormModule {}
