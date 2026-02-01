import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TrackingAppModule } from './tracking-app.module';
import { DomainExceptionFilter } from '../../../../common/filters/domain-exception.filter';
import { LOGGER_FACTORY, ILoggerFactory } from '../../../../common/contracts/logger.contract';

async function bootstrap() {
  const app = await NestFactory.create(TrackingAppModule);

  const configService = app.get(ConfigService);
  const loggerFactory = app.get<ILoggerFactory>(LOGGER_FACTORY);
  const logger = loggerFactory.create('tracking-api');

  // Prefijo global
  const apiPrefix = configService.get<string>('apiPrefix') ?? 'api';
  app.setGlobalPrefix(apiPrefix);

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro de excepciones de dominio
  app.useGlobalFilters(new DomainExceptionFilter(loggerFactory));

  // Swagger
  const swaggerEnabled = configService.get<boolean>('swagger.enabled') ?? true;
  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.get<string>('swagger.title') ?? 'API Tracking')
      .setDescription(
        configService.get<string>('swagger.description') ??
          'API de seguimiento de paquetes (HU-07, HU-08)',
      )
      .setVersion(configService.get<string>('swagger.version') ?? '1.0')
      .addTag('tracking', 'Eventos de seguimiento de paquetes')
      .addTag('health', 'Health checks del servicio')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    const swaggerPath = configService.get<string>('swagger.path') ?? 'api/docs';
    SwaggerModule.setup(swaggerPath, app, document);
    logger.log(`Swagger disponible en /${swaggerPath}`);
  }

  // Puerto
  const port = configService.get<number>('port') ?? 2003;
  await app.listen(port);

  logger.log(`tracking-api escuchando en puerto ${port}`);
  logger.log(`MongoDB: ${configService.get<string>('mongo.uri')?.replace(/\/\/.*@/, '//***@')}`);
}

bootstrap();
