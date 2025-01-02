import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to DTO instances
    whitelist: true, // Strip properties that do not exist in the DTO
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
  }));
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
