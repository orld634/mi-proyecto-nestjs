import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleDevolucionCompraService } from './detalle-devolucion-compra.service';
import { DetalleDevolucionCompraController } from '../detalle-devolucion-compra/detalle-devolucion-compra.controller';
import { DetalleDevolucionCompra } from './entities/detalle-devolucion-compra.entity';
import { DevolucionCompra } from '../devolucion-compra/entities/devolucion-compra.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DetalleDevolucionCompra,
      DevolucionCompra,
      Producto
    ])
  ],
  controllers: [DetalleDevolucionCompraController],
  providers: [DetalleDevolucionCompraService],
  exports: [DetalleDevolucionCompraService]
})
export class DetalleDevolucionCompraModule {}

// No olvides agregar este módulo al app.module.ts:
/*
import { DetalleDevolucionCompraModule } from './detalle-devolucion-compra/detalle-devolucion-compra.module';

@Module({
  imports: [
    // ... otros módulos
    DetalleDevolucionCompraModule,
  ],
  // ... resto de la configuración
})
export class AppModule {}
*/