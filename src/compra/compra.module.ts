import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompraService } from './compra.service';
import { CompraController } from './compra.controller';
import { Compra } from './entities/compra.entity';
import { User } from '../users/entities/user.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Compra, User, Proveedor])],
  controllers: [CompraController],
  providers: [CompraService],
  exports: [CompraService]
})
export class CompraModule {}