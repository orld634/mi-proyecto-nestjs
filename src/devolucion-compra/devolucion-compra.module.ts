import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevolucionCompraService } from './devolucion-compra.service';
import { DevolucionCompraController } from './devolucion-compra.controller';
import { DevolucionCompra } from './entities/devolucion-compra.entity';
import { User } from '../users/entities/user.entity';
import { Compra } from '../compra/entities/compra.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DevolucionCompra,
      User,
      Compra,
      Proveedor
    ])
  ],
  controllers: [DevolucionCompraController],
  providers: [DevolucionCompraService],
  exports: [DevolucionCompraService]
})
export class DevolucionCompraModule {}