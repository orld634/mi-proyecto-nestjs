import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';  
 import { RolesGuard } from '../auth/guards/roles.guard';
 import { Roles } from '../auth/decorators/roles.decorator'; 

@Controller('compras')
 @UseGuards(JwtAuthGuard) 
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  @Post('create')
   @UseGuards(RolesGuard)
   @Roles('admin')
  create(@Body() createCompraDto: CreateCompraDto, @Request() req) {
    // Obtener el userId del token JWT o del request
    const userId = req.user?.id || 1; // Temporal: usar 1 como fallback
    return this.compraService.create(createCompraDto, userId);
  }

  @Get()
  findAll(
    @Query('estado') estado?: string,
    @Query('proveedor') proveedor?: number,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string
  ) {
    return this.compraService.findAll({ estado, proveedor, fechaDesde, fechaHasta });
  }

  @Get('estadisticas')
  getTotalComprasPorEstado() {
    return this.compraService.getTotalComprasPorEstado();
  }

  @Get('por-admin')
  getComprasPorAdmin() {
    return this.compraService.getComprasPorAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.compraService.findOne(+id);
  }

  @Patch(':id')
  // @UseGuards(RolesGuard)
  // @Roles('admin')
  update(@Param('id') id: string, @Body() updateCompraDto: UpdateCompraDto, @Request() req) {
    const userId = req.user?.id || 1; // Temporal: usar 1 como fallback
    return this.compraService.update(+id, updateCompraDto, userId);
  }

  @Delete(':id')
  // @UseGuards(RolesGuard)
  // @Roles('admin')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id || 1; // Temporal: usar 1 como fallback
    return this.compraService.remove(+id, userId);
  }

  @Patch(':id/estado')
  // @UseGuards(RolesGuard)
  // @Roles('admin')
  updateEstado(@Param('id') id: string, @Body() body: { estado: string }, @Request() req) {
    const userId = req.user?.id || 1; // Temporal: usar 1 como fallback
    return this.compraService.updateEstado(+id, body.estado, userId);
  }

  @Get('por-proveedor/:idProveedor')
  findByProveedor(@Param('idProveedor') idProveedor: string) {
    return this.compraService.findByProveedor(+idProveedor);
  }

  @Get('por-usuario/:idUsuario')
  findByUsuario(@Param('idUsuario') idUsuario: string) {
    return this.compraService.findByUsuario(+idUsuario);
  }
}