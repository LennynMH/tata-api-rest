import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalFilters(new DomainExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const apiPrefix = config.get<string>('apiPrefix', 'api');
  app.setGlobalPrefix(apiPrefix);

  if (config.get<boolean>('swagger.enabled', true)) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(config.get<string>('swagger.title'))
      .setDescription(config.get<string>('swagger.description'))
      .setVersion(config.get<string>('swagger.version'))
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(config.get<string>('swagger.path'), app, document);
  }

  const port = config.get<number>('port', 2000);
  await app.listen(port);
}
bootstrap();
