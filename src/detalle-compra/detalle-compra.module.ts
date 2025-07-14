import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleCompraService } from './detalle-compra.service';
import { DetalleCompraController } from './detalle-compra.controller';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { Compra } from '../compra/entities/compra.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleCompra, Compra, Producto])],
  controllers: [DetalleCompraController],
  providers: [DetalleCompraService],
  exports: [DetalleCompraService],
})
export class DetalleCompraModule {}