import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PackagesAppModule } from './packages-app.module';

async function bootstrap() {
  const app = await NestFactory.create(PackagesAppModule);
  const config = app.get(ConfigService);

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
      .setTitle(config.get<string>('swagger.title') + ' (Packages)')
      .setDescription(config.get<string>('swagger.description'))
      .setVersion(config.get<string>('swagger.version'))
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(config.get<string>('swagger.path'), app, document);
  }

  const port = config.get<number>('port', 2002);
  await app.listen(port);
  console.log(`Packages API running on port ${port}`);
}
bootstrap();
