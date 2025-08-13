import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleDevolucionVentaDto } from './create-detalle-devolucion-venta.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { EstadoProductoDevolucion } from '../entities/detalle-devolucion-venta.entity';

export class UpdateDetalleDevolucionVentaDto extends PartialType(CreateDetalleDevolucionVentaDto) {
  @IsOptional()
  @IsEnum(EstadoProductoDevolucion)
  estado_producto?: EstadoProductoDevolucion;
}