import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString, IsPositive, Min } from 'class-validator';
import { CondicionProducto } from '../entities/detalle-devolucion-compra.entity';

export class CreateDetalleDevolucionCompraDto {
  @IsNotEmpty({ message: 'El ID de devolución de compra es obligatorio' })
  @IsNumber({}, { message: 'El ID de devolución de compra debe ser un número' })
  id_devolucion_compra: number;

  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  id_producto: number;

  @IsNotEmpty({ message: 'La cantidad devuelta es obligatoria' })
  @IsNumber({}, { message: 'La cantidad devuelta debe ser un número' })
  @IsPositive({ message: 'La cantidad devuelta debe ser positiva' })
  @Min(1, { message: 'La cantidad devuelta debe ser al menos 1' })
  cantidad_devuelta: number;

  @IsNotEmpty({ message: 'El precio unitario es obligatorio' })
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @IsPositive({ message: 'El precio unitario debe ser positivo' })
  precio_unitario: number;

  @IsNotEmpty({ message: 'El subtotal de devolución es obligatorio' })
  @IsNumber({}, { message: 'El subtotal de devolución debe ser un número' })
  @IsPositive({ message: 'El subtotal de devolución debe ser positivo' })
  subtotal_devolucion: number;

  @IsNotEmpty({ message: 'La condición del producto es obligatoria' })
  @IsEnum(CondicionProducto, { message: 'La condición del producto debe ser: nuevo, usado o defectuoso' })
  condicion_producto: CondicionProducto;

  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser texto' })
  observaciones?: string;
}