import { PartialType } from '@nestjs/mapped-types';
import { CreateCarritoCompraDto } from './create-carrito-compra.dto';

export class UpdateCarritoCompraDto extends PartialType(CreateCarritoCompraDto) {}