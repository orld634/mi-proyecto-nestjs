import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleCarritoService } from './detalle-carrito.service';
import { DetalleCarritoController } from './detalle-carrito.controller';
import { DetalleCarrito } from './entities/detalle-carrito.entity';

@Module({
  imports: [
    // Importa TypeOrmModule con tu entidad
    TypeOrmModule.forFeature([DetalleCarrito])
  ],
  controllers: [DetalleCarritoController],
  providers: [DetalleCarritoService],
  exports: [DetalleCarritoService] // Opcional: si otros módulos necesitan este servicio
})
export class DetalleCarritoModule {}