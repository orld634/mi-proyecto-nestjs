import { PartialType } from '@nestjs/mapped-types';
import { CreateDevolucionVentaDto } from './create-devolucion-venta.dto';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { EstadoDevolucion } from '../entities/devolucion-venta.entity';

export class UpdateDevolucionVentaDto extends PartialType(CreateDevolucionVentaDto) {
  @IsOptional()
  @IsEnum(EstadoDevolucion)
  estado?: EstadoDevolucion;

  @IsOptional()
  @IsString()
  observaciones?: string;
}