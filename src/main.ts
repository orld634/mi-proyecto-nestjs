import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   await app.listen(8222);
  
  // Obtener el puerto asignado
 
}
bootstrap();