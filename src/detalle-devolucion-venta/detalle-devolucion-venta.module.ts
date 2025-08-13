import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleDevolucionVentaService } from './detalle-devolucion-venta.service';
import { DetalleDevolucionVentaController } from './detalle-devolucion-venta.controller';
import { DetalleDevolucionVenta } from './entities/detalle-devolucion-venta.entity';
import { DevolucionVenta } from '../devolucion-venta/entities/devolucion-venta.entity';
import { Producto } from '../productos/entities/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetalleDevolucionVenta, DevolucionVenta, Producto])
  ],
  controllers: [DetalleDevolucionVentaController],
  providers: [DetalleDevolucionVentaService],
  exports: [DetalleDevolucionVentaService], // Exportar el servicio para uso en otros módulos
})
export class DetalleDevolucionVentaModule {}