import { IsString, IsNumber, IsOptional, IsBoolean, IsPositive, IsInt, Min, MaxLength, IsUrl } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MaxLength(50)
  codigo_barras: string;

  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @MaxLength(50)
  marca: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_compra: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_venta: number;

  @IsInt()
  @Min(0)
  stock_minimo: number;

  @IsInt()
  @Min(0)
  stock_actual: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagen_url?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;

  @IsInt()
  @IsPositive()
  id_categoria: number;
}