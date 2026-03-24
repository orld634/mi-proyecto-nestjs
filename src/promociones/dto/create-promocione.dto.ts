// src/promociones/dto/create-promocione.dto.ts
import { IsBoolean, IsDateString, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreatePromocionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre_promocion: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  descuento: number;

  @IsDateString()
  @IsNotEmpty()
  fecha_inicio: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_fin: string;

  @IsInt()
  @Min(0)
  cantidad_productos: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsInt()
  @IsNotEmpty()
  id_producto: number;
}