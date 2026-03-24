// src/promociones/dto/update-promocion.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePromocionDto } from '../dto/create-promocione.dto';

export class UpdatePromocionDto extends PartialType(CreatePromocionDto) {}