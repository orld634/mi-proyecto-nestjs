import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProveedoreDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  nombreEmpresa: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  telefono: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  contacto: string;
}