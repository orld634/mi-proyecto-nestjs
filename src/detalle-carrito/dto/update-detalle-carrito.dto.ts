import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleCarritoDto } from './create-detalle-carrito.dto';
import { IsNumber, IsPositive, Min, IsOptional } from 'class-validator';

export class UpdateDetalleCarritoDto extends PartialType(CreateDetalleCarritoDto) {
  @IsOptional()
  @IsNumber({}, { message: 'El ID del carrito de compra debe ser un número' })
  @IsPositive({ message: 'El ID del carrito de compra debe ser un número positivo' })
  idCarritoCompra?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  @IsPositive({ message: 'El ID del producto debe ser un número positivo' })
  idProducto?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  cantidad?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @IsPositive({ message: 'El precio unitario debe ser un número positivo' })
  precioUnitario?: number;

  // Propiedad interna para el cálculo automático del subtotal
  subtotal?: number;
}