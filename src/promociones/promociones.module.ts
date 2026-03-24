// src/promociones/promociones.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocionesController } from './promociones.controller';
import { PromocionesService } from './promociones.service';
import { Promocion } from './entities/promocione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promocion])],
  controllers: [PromocionesController],
  providers: [PromocionesService],
  exports: [PromocionesService],
})
export class PromocionesModule {}