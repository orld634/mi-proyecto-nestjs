import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional, IsDecimal, MaxLength, IsDateString } from 'class-validator';
import { EstadoDevolucion } from '../entities/devolucion-venta.entity';
import { Type } from 'class-transformer';

export class CreateDevolucionVentaDto {
  @IsNotEmpty()
  @IsNumber()
  id_venta: number;

  @IsNotEmpty()
  @IsNumber()
  id_usuario: number;

  @IsNotEmpty()
  @IsDateString()
  fecha_devolucion: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  motivo: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  monto_devuelto: number;

  @IsOptional()
  @IsEnum(EstadoDevolucion)
  estado?: EstadoDevolucion;

  @IsOptional()
  @IsString()
  observaciones?: string;
}