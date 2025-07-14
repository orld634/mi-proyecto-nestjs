import { IsInt, IsNumber, IsPositive, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDetalleCompraDto {
  @IsInt()
  @IsPositive()
  id_compra: number;

  @IsInt()
  @IsPositive()
  id_producto: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  precio_unitario: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  subtotal: number;
}