import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CarritoCompraService } from './carrito-compra.service';
import { CreateCarritoCompraDto } from './dto/create-carrito-compra.dto';
import { UpdateCarritoCompraDto } from './dto/update-carrito-compra.dto';

@Controller('carrito-compra')
export class CarritoCompraController {
  constructor(private readonly carritoCompraService: CarritoCompraService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCarritoCompraDto: CreateCarritoCompraDto) {
    return this.carritoCompraService.create(createCarritoCompraDto);
  }

  @Get()
  findAll() {
    return this.carritoCompraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carritoCompraService.findOne(+id);
  }

  @Get('usuario/:idUsuario')
  findByUsuario(@Param('idUsuario') idUsuario: string) {
    return this.carritoCompraService.findByUsuario(+idUsuario);
  }

  @Get('activo/usuario/:idUsuario')
  findCarritoActivoByUsuario(@Param('idUsuario') idUsuario: string) {
    return this.carritoCompraService.findCarritoActivoByUsuario(+idUsuario);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarritoCompraDto: UpdateCarritoCompraDto) {
    return this.carritoCompraService.update(+id, updateCarritoCompraDto);
  }

  @Patch(':id/subtotal')
  updateSubtotal(@Param('id') id: string, @Body('subtotal') subtotal: number) {
    return this.carritoCompraService.updateSubtotal(+id, subtotal);
  }

  @Patch(':id/desactivar')
  desactivarCarrito(@Param('id') id: string) {
    return this.carritoCompraService.desactivarCarrito(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.carritoCompraService.remove(+id);
  }
}