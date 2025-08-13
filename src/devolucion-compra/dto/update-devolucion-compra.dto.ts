import { PartialType } from '@nestjs/mapped-types';
import { CreateDevolucionCompraDto } from './create-devolucion-compra.dto';

export class UpdateDevolucionCompraDto extends PartialType(CreateDevolucionCompraDto) {}