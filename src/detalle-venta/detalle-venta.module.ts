import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVentaService } from './detalle-venta.service';
import { DetalleVentaController } from './detalle-venta.controller';
import { DetalleVenta } from './entities/detalle-venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleVenta])],
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService],
  exports: [DetalleVentaService]
})
export class DetalleVentaModule {}