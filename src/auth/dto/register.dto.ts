import { IsEmail, IsNotEmpty, IsString, MinLength, Length, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @Length(2, 100, { message: 'El apellido debe tener entre 2 y 100 caracteres' })
  apellido: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsOptional()
  @IsString({ message: 'El rol debe ser una cadena de texto' })
  role?: string;
}