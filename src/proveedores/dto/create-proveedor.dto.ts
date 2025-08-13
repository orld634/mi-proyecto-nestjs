import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  nombre_empresa: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  contacto?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @MinLength(7)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  pais?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @MinLength(5)
  ruc_nit?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}
