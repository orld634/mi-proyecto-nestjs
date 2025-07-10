import { IsNumber, IsDateString, IsEnum, IsOptional, IsPositive, Min } from 'class-validator';
import { EstadoVenta } from '../entities/venta.entity';

export class UpdateVentaDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id_usuario?: number;

  @IsOptional()
  @IsDateString()
  fecha_venta?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  impuesto?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  descuento?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  total_venta?: number;

  @IsOptional()
  @IsEnum(EstadoVenta)
  estado?: EstadoVenta;
}