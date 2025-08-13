import { IsString, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}