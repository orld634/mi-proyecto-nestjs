import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional, IsDateString, IsDecimal, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoDevolucionCompra } from '../entities/devolucion-compra.entity';

export class CreateDevolucionCompraDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id_compra: number;

  @IsNotEmpty()
  @IsString()
  rol_encargado: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id_proveedor: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id_usuario: number;

  @IsNotEmpty()
  @IsDateString()
  fecha_devolucion: string;

  @IsNotEmpty()
  @IsString()
  motivo: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Type(() => Number)
  monto_devuelto: number;

  @IsOptional()
  @IsEnum(EstadoDevolucionCompra)
  estado?: EstadoDevolucionCompra;

  @IsOptional()
  @IsString()
  observaciones?: string;
}