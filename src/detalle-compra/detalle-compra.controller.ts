import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DetalleCompraService } from './detalle-compra.service';
import { CreateDetalleCompraDto } from './dto/create-detalle-compra.dto';
import { UpdateDetalleCompraDto } from './dto/update-detalle-compra.dto';

@Controller('detalle-compra')
export class DetalleCompraController {
  constructor(private readonly detalleCompraService: DetalleCompraService) {}

  @Post()
  create(@Body() createDetalleCompraDto: CreateDetalleCompraDto) {
    return this.detalleCompraService.create(createDetalleCompraDto);
  }

  @Get()
  findAll() {
    return this.detalleCompraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detalleCompraService.findOne(id);
  }

  @Get('compra/:idCompra')
  findByCompra(@Param('idCompra', ParseIntPipe) idCompra: number) {
    return this.detalleCompraService.findByCompra(idCompra);
  }

  @Get('compra/:idCompra/total')
  calculateTotalCompra(@Param('idCompra', ParseIntPipe) idCompra: number) {
    return this.detalleCompraService.calculateTotalCompra(idCompra);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDetalleCompraDto: UpdateDetalleCompraDto,
  ) {
    return this.detalleCompraService.update(id, updateDetalleCompraDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.detalleCompraService.remove(id);
  }

  @Delete('compra/:idCompra')
  removeByCompra(@Param('idCompra', ParseIntPipe) idCompra: number) {
    return this.detalleCompraService.removeByCompra(idCompra);
  }
}