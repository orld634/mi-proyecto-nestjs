import { IsString, IsEmail, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  nombre_empresa: string;

  @IsString()
  @MaxLength(100)
  @MinLength(2)
  contacto: string;

  @IsString()
  @MaxLength(20)
  @MinLength(7)
  telefono: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(10)
  direccion: string;

  @IsString()
  @MaxLength(50)
  @MinLength(2)
  pais: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;

  @IsString()
  @MaxLength(20)
  @MinLength(5)
  ruc_nit: string;
}