import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateDetalleCarritoDto {
  @IsNotEmpty({ message: 'El ID del carrito de compra es obligatorio' })
  @IsNumber({}, { message: 'El ID del carrito de compra debe ser un número' })
  @IsPositive({ message: 'El ID del carrito de compra debe ser un número positivo' })
  idCarritoCompra: number;

  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  @IsPositive({ message: 'El ID del producto debe ser un número positivo' })
  idProducto: number;

  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  cantidad: number;

  @IsNotEmpty({ message: 'El precio unitario es obligatorio' })
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @IsPositive({ message: 'El precio unitario debe ser un número positivo' })
  precioUnitario: number;

  // El subtotal se calcula automáticamente, no es necesario enviarlo
  // La fecha de agregado se genera automáticamente
}