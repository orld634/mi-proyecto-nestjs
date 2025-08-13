import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioMovimientoService } from './inventario-movimiento.service';
import { InventarioMovimientoController } from './inventario-movimiento.controller';
import { InventarioMovimiento } from './entities/inventario-movimiento.entity';
import { Producto } from '../productos/entities/producto.entity'; // Asegúrate de que la ruta esté bien
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventarioMovimiento, Producto, User]), // 👈 Importa ambas entidades
  ],
  controllers: [InventarioMovimientoController],
  providers: [InventarioMovimientoService],
})
export class InventarioMovimientoModule {}
