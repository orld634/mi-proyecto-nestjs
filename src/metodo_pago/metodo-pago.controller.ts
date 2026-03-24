// src/metodo-pago/metodo-pago.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseBoolPipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MetodoPagoService } from './metodo-pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';

@Controller('metodos-pago')
export class MetodoPagoController {
  constructor(private readonly metodoPagoService: MetodoPagoService) {}

  @Post()
  create(@Body() createMetodoPagoDto: CreateMetodoPagoDto) {
    return this.metodoPagoService.create(createMetodoPagoDto);
  }

  @Get()
  findAll(@Query('activos', new ParseBoolPipe({ optional: true })) activosSolo?: boolean) {
    return this.metodoPagoService.findAll(activosSolo ?? true);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.metodoPagoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMetodoPagoDto: UpdateMetodoPagoDto,
  ) {
    return this.metodoPagoService.update(id, updateMetodoPagoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.metodoPagoService.remove(id);
  }

  @Patch(':id/desactivar')
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.metodoPagoService.desactivar(id);
  }
}