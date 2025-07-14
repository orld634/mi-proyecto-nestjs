import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';

@Controller('detalle-venta')
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService) {}

  @Post()
  create(@Body() createDetalleVentaDto: CreateDetalleVentaDto) {
    return this.detalleVentaService.create(createDetalleVentaDto);
  }

  @Get()
  findAll() {
    return this.detalleVentaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detalleVentaService.findOne(id);
  }

  @Get('venta/:id_venta')
  findByVenta(@Param('id_venta', ParseIntPipe) id_venta: number) {
    return this.detalleVentaService.findByVenta(id_venta);
  }

  @Get('producto/:id_producto')
  findByProducto(@Param('id_producto', ParseIntPipe) id_producto: number) {
    return this.detalleVentaService.findByProducto(id_producto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDetalleVentaDto: UpdateDetalleVentaDto) {
    return this.detalleVentaService.update(id, updateDetalleVentaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.detalleVentaService.remove(id);
  }
}