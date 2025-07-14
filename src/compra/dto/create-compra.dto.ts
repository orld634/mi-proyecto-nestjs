import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min, MaxLength } from 'class-validator';
import { EstadoCompra } from '../entities/compra.entity';

export class CreateCompraDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  numero_orden: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  id_proveedor: number;

  @IsNotEmpty()
  @IsDateString()
  fecha_compra: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  total_compra: number;

  @IsOptional()
  @IsEnum(EstadoCompra)
  estado?: EstadoCompra;

  @IsOptional()
  @IsString()
  observaciones?: string;

  // Nota: id_usuario se asigna automáticamente desde el token JWT
  // No se incluye en el DTO para evitar manipulación
}