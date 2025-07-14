import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateDetalleVentaDto {
  @IsNotEmpty()
  @IsNumber()
  id_venta: number;

  @IsNotEmpty()
  @IsNumber()
  id_producto: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  precio_unitario: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  subtotal: number;
}