// src/promociones/promociones.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PromocionesService } from './promociones.service';
import { CreatePromocionDto } from '../promociones/dto/create-promocione.dto';
import { UpdatePromocionDto } from './dto/update-promocione.dto';

@Controller('promociones')
export class PromocionesController {
  constructor(private readonly promocionesService: PromocionesService) {}

  @Post()
  create(@Body() createPromocionDto: CreatePromocionDto) {
    return this.promocionesService.create(createPromocionDto);
  }

  @Get()
  findAll() {
    return this.promocionesService.findAll();
  }

  @Get('activas')
  findActivas() {
    return this.promocionesService.findActivas();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePromocionDto: UpdatePromocionDto,
  ) {
    return this.promocionesService.update(id, updatePromocionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.remove(id);
  }

  @Patch(':id/desactivar')
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.desactivar(id);
  }
}