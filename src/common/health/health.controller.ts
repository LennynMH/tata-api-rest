import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

/**
 * Health check usando @nestjs/terminus
 * Formato estándar para Kubernetes, Docker, load balancers
 */
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly config: ConfigService,
  ) {}

  private get dbTimeout(): number {
    return this.config.get<number>('health.dbTimeoutMs', 1500);
  }

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: this.dbTimeout }),
    ]);
  }

  /**
   * Liveness probe - ¿la app está viva?
   */
  @Get('live')
  live() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  /**
   * Readiness probe - ¿la app está lista para recibir tráfico?
   * Incluye verificación de BD
   */
  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: this.dbTimeout }),
    ]);
  }
}
