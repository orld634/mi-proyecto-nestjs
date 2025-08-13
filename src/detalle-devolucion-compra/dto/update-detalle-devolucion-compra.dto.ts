import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { EstadoDetalle } from '../entities/detalle-devolucion-compra.entity';
import { CreateDetalleDevolucionCompraDto } from './create-detalle-devolucion-compra.dto'; // 

export class UpdateDetalleDevolucionCompraDto extends PartialType(CreateDetalleDevolucionCompraDto) {
  @IsOptional()
  @IsEnum(EstadoDetalle, { message: 'El estado debe ser: pendiente, aprobada o rechazada' })
  estado?: EstadoDetalle;
}