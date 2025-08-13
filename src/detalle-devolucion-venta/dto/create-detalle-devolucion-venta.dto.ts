import { IsNotEmpty, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { EstadoProductoDevolucion } from '../entities/detalle-devolucion-venta.entity';
import { Type } from 'class-transformer';

export class CreateDetalleDevolucionVentaDto {
  @IsNotEmpty()
  @IsNumber()
  id_devolucion_venta: number;

  @IsNotEmpty()
  @IsNumber()
  id_producto: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Las unidades devueltas deben ser mayor a 0' })
  unidades_devueltas: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0, { message: 'El precio unitario debe ser mayor o igual a 0' })
  precio_unitario: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0, { message: 'El subtotal debe ser mayor o igual a 0' })
  subtotal_devolucion: number;

  @IsOptional()
  @IsEnum(EstadoProductoDevolucion)
  estado_producto?: EstadoProductoDevolucion;
}