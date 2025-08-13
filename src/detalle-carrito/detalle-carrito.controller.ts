import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { DetalleCarritoService } from './detalle-carrito.service';
import { CreateDetalleCarritoDto } from './dto/create-detalle-carrito.dto';
import { UpdateDetalleCarritoDto } from './dto/update-detalle-carrito.dto';

@Controller('detalle-carrito')
export class DetalleCarritoController {
  constructor(private readonly detalleCarritoService: DetalleCarritoService) {}

  @Post()
  async create(@Body() createDetalleCarritoDto: CreateDetalleCarritoDto) {
    return await this.detalleCarritoService.create(createDetalleCarritoDto);
  }

  @Get()
  async findAll() {
    return await this.detalleCarritoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.detalleCarritoService.findOne(id);
  }

  @Get('carrito/:idCarritoCompra')
  async findByCarritoId(@Param('idCarritoCompra', ParseIntPipe) idCarritoCompra: number) {
    return await this.detalleCarritoService.findByCarritoId(idCarritoCompra);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDetalleCarritoDto: UpdateDetalleCarritoDto
  ) {
    return await this.detalleCarritoService.update(id, updateDetalleCarritoDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.detalleCarritoService.remove(id);
    return { message: 'Detalle de carrito eliminado exitosamente' };
  }

  @Delete('carrito/:idCarritoCompra')
  async removeByCarritoId(@Param('idCarritoCompra', ParseIntPipe) idCarritoCompra: number) {
    await this.detalleCarritoService.removeByCarritoId(idCarritoCompra);
    return { message: 'Detalles del carrito eliminados exitosamente' };
  }
}