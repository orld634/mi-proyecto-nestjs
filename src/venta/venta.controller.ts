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
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { EstadoVenta } from './entities/venta.entity';

@Controller('ventas')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventaService.create(createVentaDto);
  }

  @Get()
  findAll() {
    return this.ventaService.findAll();
  }

  @Get('estadisticas')
  getTotalVentas() {
    return this.ventaService.getTotalVentas();
  }

  @Get('montos')
  getMontoTotalVentas() {
    return this.ventaService.getMontoTotalVentas();
  }

  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario', ParseIntPipe) id_usuario: number) {
    return this.ventaService.findByUsuario(id_usuario);
  }

  @Get('estado/:estado')
  findByEstado(@Param('estado') estado: EstadoVenta) {
    return this.ventaService.findByEstado(estado);
  }

  @Get('periodo')
  getVentasPorPeriodo(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return this.ventaService.getVentasPorPeriodo(inicio, fin);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateVentaDto: UpdateVentaDto
  ) {
    return this.ventaService.update(id, updateVentaDto);
  }

  @Patch(':id/completar')
  completarVenta(@Param('id', ParseIntPipe) id: number) {
    return this.ventaService.completarVenta(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ventaService.remove(id);
  }
}