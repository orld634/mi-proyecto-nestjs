import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsDecimal, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarritoCompraDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  idUsuario: number;

  @IsOptional()
  @IsString()
  @IsEnum(['activo', 'inactivo'])
  estado?: string = 'activo';

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  subtotal?: number = 0;
}