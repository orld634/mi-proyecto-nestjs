import { PartialType } from '@nestjs/mapped-types';
import { CreateProveedoreDto } from '../dto/create-proveedore.dto';

export class UpdateProveedoreDto extends PartialType(CreateProveedoreDto) {}
