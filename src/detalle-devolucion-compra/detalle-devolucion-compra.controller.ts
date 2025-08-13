import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { DetalleDevolucionCompraService } from './detalle-devolucion-compra.service';
import { CreateDetalleDevolucionCompraDto } from './dto/create-detalle-devolucion-compra.dto';
import { UpdateDetalleDevolucionCompraDto } from './dto/update-detalle-devolucion-compra.dto';
import { EstadoDetalle, CondicionProducto } from './entities/detalle-devolucion-compra.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('detalle-devolucion-compra')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DetalleDevolucionCompraController {
  constructor(private readonly detalleDevolucionCompraService: DetalleDevolucionCompraService) {}

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDetalleDevolucionCompraDto: CreateDetalleDevolucionCompraDto) {
    return {
      message: 'Detalle de devolución de compra creado exitosamente',
      data: await this.detalleDevolucionCompraService.create(createDetalleDevolucionCompraDto)
    };
  }

  @Get()
  @Roles('admin')
  async findAll(
    @Query('estado') estado?: EstadoDetalle,
    @Query('condicion') condicion?: CondicionProducto
  ) {
    let data;

    if (estado && condicion) {
      // Si se necesita filtrar por ambos, crear método específico en el service
      data = await this.detalleDevolucionCompraService.findAll();
      data = data.filter(item => item.estado === estado && item.condicion_producto === condicion);
    } else if (estado) {
      data = await this.detalleDevolucionCompraService.findByEstado(estado);
    } else if (condicion) {
      data = await this.detalleDevolucionCompraService.findByCondicion(condicion);
    } else {
      data = await this.detalleDevolucionCompraService.findAll();
    }

    return {
      message: 'Detalles de devolución de compra obtenidos exitosamente',
      data
    };
  }

  @Get('estadisticas/por-estado')
  @Roles('admin')
  async getEstadisticasPorEstado() {
    return {
      message: 'Estadísticas por estado obtenidas exitosamente',
      data: await this.detalleDevolucionCompraService.getEstadisticasPorEstado()
    };
  }

  @Get('estadisticas/por-condicion')
  @Roles('admin')
  async getEstadisticasPorCondicion() {
    return {
      message: 'Estadísticas por condición obtenidas exitosamente',
      data: await this.detalleDevolucionCompraService.getEstadisticasPorCondicion()
    };
  }

  @Get('devolucion/:id')
  @Roles('admin')
  async findByDevolucionCompra(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Detalles de la devolución obtenidos exitosamente',
      data: await this.detalleDevolucionCompraService.findByDevolucionCompra(id)
    };
  }

  @Get('producto/:id')
  @Roles('admin')
  async findByProducto(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Detalles del producto obtenidos exitosamente',
      data: await this.detalleDevolucionCompraService.findByProducto(id)
    };
  }

  @Get('devolucion/:id/estadisticas')
  @Roles('admin')
  async getEstadisticasDevolucion(@Param('id', ParseIntPipe) id: number) {
    const totalDetalles = await this.detalleDevolucionCompraService.getTotalDetallesPorDevolucion(id);
    const montoTotal = await this.detalleDevolucionCompraService.getMontoTotalPorDevolucion(id);
    
    return {
      message: 'Estadísticas de la devolución obtenidas exitosamente',
      data: {
        total_detalles: totalDetalles,
        monto_total: montoTotal
      }
    };
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Detalle de devolución de compra obtenido exitosamente',
      data: await this.detalleDevolucionCompraService.findOne(id)
    };
  }

  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDetalleDevolucionCompraDto: UpdateDetalleDevolucionCompraDto
  ) {
    return {
      message: 'Detalle de devolución de compra actualizado exitosamente',
      data: await this.detalleDevolucionCompraService.update(id, updateDetalleDevolucionCompraDto)
    };
  }

  @Patch(':id/aprobar')
  @Roles('admin')
  async aprobar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { observaciones?: string }
  ) {
    return {
      message: 'Detalle de devolución de compra aprobado exitosamente',
      data: await this.detalleDevolucionCompraService.aprobar(id, body.observaciones)
    };
  }

  @Patch(':id/rechazar')
  @Roles('admin')
  async rechazar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { observaciones: string }
  ) {
    return {
      message: 'Detalle de devolución de compra rechazado exitosamente',
      data: await this.detalleDevolucionCompraService.rechazar(id, body.observaciones)
    };
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.detalleDevolucionCompraService.remove(id);
    return {
      message: 'Detalle de devolución de compra eliminado exitosamente'
    };
  }
}