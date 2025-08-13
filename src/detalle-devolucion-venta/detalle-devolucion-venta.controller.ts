import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { DetalleDevolucionVentaService } from './detalle-devolucion-venta.service';
import { CreateDetalleDevolucionVentaDto } from './dto/create-detalle-devolucion-venta.dto';
import { UpdateDetalleDevolucionVentaDto } from './dto/update-detalle-devolucion-venta.dto';
import { EstadoProductoDevolucion } from './entities/detalle-devolucion-venta.entity';

@Controller('detalle-devolucion-venta')
export class DetalleDevolucionVentaController {
  constructor(private readonly detalleDevolucionVentaService: DetalleDevolucionVentaService) {}

  @Post()
  create(@Body() createDetalleDevolucionVentaDto: CreateDetalleDevolucionVentaDto) {
    return this.detalleDevolucionVentaService.create(createDetalleDevolucionVentaDto);
  }

  @Post('multiple')
  createMultiple(@Body() createDetalleDevolucionVentaDtos: CreateDetalleDevolucionVentaDto[]) {
    return this.detalleDevolucionVentaService.createMultiple(createDetalleDevolucionVentaDtos);
  }

  @Get()
  findAll(@Query('estado_producto') estadoProducto?: EstadoProductoDevolucion) {
    if (estadoProducto) {
      return this.detalleDevolucionVentaService.findByEstadoProducto(estadoProducto);
    }
    return this.detalleDevolucionVentaService.findAll();
  }

  @Get('estadisticas/productos')
  getEstadisticasProductos() {
    return this.detalleDevolucionVentaService.getEstadisticasProductos();
  }

  @Get('estadisticas/estado-producto')
  getEstadisticasPorEstadoProducto() {
    return this.detalleDevolucionVentaService.getEstadisticasPorEstadoProducto();
  }

  @Get('devolucion/:devolucionId')
  findByDevolucion(@Param('devolucionId', ParseIntPipe) devolucionId: number) {
    return this.detalleDevolucionVentaService.findByDevolucion(devolucionId);
  }

  @Get('producto/:productoId')
  findByProducto(@Param('productoId', ParseIntPipe) productoId: number) {
    return this.detalleDevolucionVentaService.findByProducto(productoId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detalleDevolucionVentaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDetalleDevolucionVentaDto: UpdateDetalleDevolucionVentaDto,
  ) {
    return this.detalleDevolucionVentaService.update(id, updateDetalleDevolucionVentaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.detalleDevolucionVentaService.remove(id);
  }
}