import { Controller, Get } from '@nestjs/common';

/**
 * Health check sin TypeORM (sin verificación de BD).
 * Usado por tracking-api u otros servicios que no usan TypeORM.
 * Expone GET /health, /health/live, /health/ready con respuesta básica.
 */
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('live')
  live() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  ready() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
