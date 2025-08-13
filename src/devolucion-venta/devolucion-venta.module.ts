import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevolucionVentaService } from './devolucion-venta.service';
import { DevolucionVentaController } from './devolucion-venta.controller';
import { DevolucionVenta } from './entities/devolucion-venta.entity';
import { Venta } from '../venta/entities/venta.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DevolucionVenta, Venta, User])
  ],
  controllers: [DevolucionVentaController],
  providers: [DevolucionVentaService],
  exports: [DevolucionVentaService], // Exportar el servicio para uso en otros módulos
})
export class DevolucionVentaModule {}