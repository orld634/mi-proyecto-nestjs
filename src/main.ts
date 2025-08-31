import 'reflect-metadata'; // ← AGREGA ESTA LÍNEA AL INICIO
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar validación global (opcional pero recomendado)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  app.enableCors();
  await app.listen(8222);
  console.log('Aplicación corriendo en http://localhost:8222');
}
bootstrap();