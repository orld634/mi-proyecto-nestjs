// src/metodo-pago/metodo-pago.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetodoPago } from './entities/metodo-pago.entity';
import { MetodoPagoService } from './metodo-pago.service';
import { MetodoPagoController } from './metodo-pago.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MetodoPago])],
  controllers: [MetodoPagoController],
  providers: [MetodoPagoService],
  exports: [MetodoPagoService], // ← útil si quieres usarlo desde otros módulos
})
export class MetodoPagoModule {}