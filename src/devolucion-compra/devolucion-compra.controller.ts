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
  Request,
  ParseIntPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { DevolucionCompraService } from './devolucion-compra.service';
import { CreateDevolucionCompraDto } from './dto/create-devolucion-compra.dto';
import { UpdateDevolucionCompraDto } from './dto/update-devolucion-compra.dto';
import { EstadoDevolucionCompra } from './entities/devolucion-compra.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('devolucion-compra')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DevolucionCompraController {
  constructor(private readonly devolucionCompraService: DevolucionCompraService) {}

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDevolucionCompraDto: CreateDevolucionCompraDto) {
    return {
      message: 'Devolución de compra creada exitosamente',
      data: await this.devolucionCompraService.create(createDevolucionCompraDto)
    };
  }

  @Get()
  @Roles('admin')
  async findAll(@Query('estado') estado?: EstadoDevolucionCompra) {
    let data;
    
    if (estado) {
      data = await this.devolucionCompraService.findByEstado(estado);
    } else {
      data = await this.devolucionCompraService.findAll();
    }

    return {
      message: 'Devoluciones de compra obtenidas exitosamente',
      data
    };
  }

  @Get('estadisticas')
  @Roles('admin')
  async getEstadisticas() {
    return {
      message: 'Estadísticas de devoluciones obtenidas exitosamente',
      data: await this.devolucionCompraService.getTotalDevoluciones()
    };
  }

  @Get('usuario/:id')
  @Roles('admin')
  async findByUsuario(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Devoluciones del usuario obtenidas exitosamente',
      data: await this.devolucionCompraService.findByUsuario(id)
    };
  }

  @Get('proveedor/:id')
  @Roles('admin')
  async findByProveedor(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Devoluciones del proveedor obtenidas exitosamente',
      data: await this.devolucionCompraService.findByProveedor(id)
    };
  }

  @Get('mis-devoluciones')
  @Roles('admin')
  async findMyDevoluciones(@Request() req) {
    return {
      message: 'Mis devoluciones obtenidas exitosamente',
      data: await this.devolucionCompraService.findByUsuario(req.user.id)
    };
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Devolución de compra obtenida exitosamente',
      data: await this.devolucionCompraService.findOne(id)
    };
  }

  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDevolucionCompraDto: UpdateDevolucionCompraDto,
    @Request() req
  ) {
    return {
      message: 'Devolución de compra actualizada exitosamente',
      data: await this.devolucionCompraService.update(id, updateDevolucionCompraDto, req.user.id)
    };
  }

  @Patch(':id/aprobar')
  @Roles('admin')
  async aprobar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { observaciones?: string },
    @Request() req
  ) {
    return {
      message: 'Devolución de compra aprobada exitosamente',
      data: await this.devolucionCompraService.aprobar(id, req.user.id, body.observaciones)
    };
  }

  @Patch(':id/rechazar')
  @Roles('admin')
  async rechazar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { observaciones: string },
    @Request() req
  ) {
    return {
      message: 'Devolución de compra rechazada exitosamente',
      data: await this.devolucionCompraService.rechazar(id, req.user.id, body.observaciones)
    };
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.devolucionCompraService.remove(id, req.user.id);
    return {
      message: 'Devolución de compra eliminada exitosamente'
    };
  }
}