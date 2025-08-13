import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString, IsDateString, Min, Max } from 'class-validator';
import { TipoMovimiento } from '../../inventario-movimiento/entities/inventario-movimiento.entity';

export class CreateInventarioMovimientoDto {
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  idProducto: number;

  @IsNotEmpty({ message: 'El tipo de movimiento es requerido' })
  @IsEnum(TipoMovimiento, { message: 'Tipo de movimiento no válido' })
  tipoMovimiento: TipoMovimiento;

  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'La cantidad debe ser un número válido' })
  @Min(0.01, { message: 'La cantidad debe ser mayor a 0' })
  cantidad: number;

  @IsNotEmpty({ message: 'El precio unitario es requerido' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio unitario debe ser un número válido' })
  @Min(0, { message: 'El precio unitario debe ser mayor o igual a 0' })
  precioUnitario: number;

  @IsOptional()
  @IsString({ message: 'La referencia debe ser una cadena de texto' })
  referencia?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de movimiento debe ser una fecha válida' })
  fechaMovimiento?: Date;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El stock mínimo debe ser un número válido' })
  @Min(0, { message: 'El stock mínimo debe ser mayor o igual a 0' })
  stockMinimo?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El stock máximo debe ser un número válido' })
  @Min(0, { message: 'El stock máximo debe ser mayor o igual a 0' })
  stockMaximo?: number;

  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string;
}