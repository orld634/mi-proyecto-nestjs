import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoCompraService } from './carrito-compra.service';
import { CarritoCompraController } from './carrito-compra.controller';
import { CarritoCompra } from './entities/carrito-compra.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarritoCompra]),
    UsersModule
  ],
  controllers: [CarritoCompraController],
  providers: [CarritoCompraService],
  exports: [CarritoCompraService]
})
export class CarritoCompraModule {}