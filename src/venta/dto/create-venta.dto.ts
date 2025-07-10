import { IsNumber, IsDateString, IsEnum, IsOptional, IsPositive, Min } from 'class-validator';
import { EstadoVenta } from '../entities/venta.entity';

export class CreateVentaDto {
  @IsNumber()
  @IsPositive()
  id_usuario: number;

  @IsDateString()
  fecha_venta: Date;

  @IsNumber()
  @IsPositive()
  subtotal: number;

  @IsNumber()
  @Min(0)
  impuesto: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  descuento?: number;

  @IsNumber()
  @IsPositive()
  total_venta: number;

  @IsOptional()
  @IsEnum(EstadoVenta)
  estado?: EstadoVenta;
}
