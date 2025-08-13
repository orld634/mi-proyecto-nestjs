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
  UseGuards,
} from '@nestjs/common';
import { DevolucionVentaService } from './devolucion-venta.service';
import { CreateDevolucionVentaDto } from './dto/create-devolucion-venta.dto';
import { UpdateDevolucionVentaDto } from './dto/update-devolucion-venta.dto';
import { EstadoDevolucion } from './entities/devolucion-venta.entity';

@Controller('devolucion-venta')
export class DevolucionVentaController {
  constructor(private readonly devolucionVentaService: DevolucionVentaService) {}

  @Post()
  create(@Body() createDevolucionVentaDto: CreateDevolucionVentaDto) {
    return this.devolucionVentaService.create(createDevolucionVentaDto);
  }

  @Get()
  findAll(@Query('estado') estado?: EstadoDevolucion) {
    if (estado) {
      return this.devolucionVentaService.findByEstado(estado);
    }
    return this.devolucionVentaService.findAll();
  }

  @Get('estadisticas')
  getEstadisticas() {
    return this.devolucionVentaService.getEstadisticas();
  }

  @Get('usuario/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.devolucionVentaService.findByUser(userId);
  }

  @Get('venta/:ventaId')
  findByVenta(@Param('ventaId', ParseIntPipe) ventaId: number) {
    return this.devolucionVentaService.findByVenta(ventaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.devolucionVentaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDevolucionVentaDto: UpdateDevolucionVentaDto,
  ) {
    return this.devolucionVentaService.update(id, updateDevolucionVentaDto);
  }

  @Patch(':id/aprobar')
  aprobar(
    @Param('id', ParseIntPipe) id: number,
    @Body('observaciones') observaciones?: string,
  ) {
    return this.devolucionVentaService.aprobar(id, observaciones);
  }

  @Patch(':id/rechazar')
  rechazar(
    @Param('id', ParseIntPipe) id: number,
    @Body('observaciones') observaciones: string,
  ) {
    return this.devolucionVentaService.rechazar(id, observaciones);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.devolucionVentaService.remove(id);
  }
}