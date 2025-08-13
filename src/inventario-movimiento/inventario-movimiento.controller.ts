import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventarioMovimientoService } from './inventario-movimiento.service';
import { CreateInventarioMovimientoDto } from './dto/create-inventario-movimiento.dto';
import { UpdateInventarioMovimientoDto } from './dto/update-inventario-movimiento.dto';
import { User  } from 'src/auth/decorators/user.decorator'; // Ajusta la ruta si es diferente

@Controller('inventario-movimiento')
export class InventarioMovimientoController {
  constructor(private readonly inventarioMovimientoService: InventarioMovimientoService) {}

  @Post()
  create(
    @Body() createInventarioMovimientoDto: CreateInventarioMovimientoDto,
    @User('id') usuarioId: number,
  ) {
    return this.inventarioMovimientoService.create(createInventarioMovimientoDto, usuarioId);
  }

  @Get()
  findAll() {
    return this.inventarioMovimientoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventarioMovimientoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventarioMovimientoDto: UpdateInventarioMovimientoDto,
    @User('id') usuarioId: number,
  ) {
    return this.inventarioMovimientoService.update(+id, updateInventarioMovimientoDto, usuarioId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User('id') usuarioId: number,
  ) {
    return this.inventarioMovimientoService.remove(+id, usuarioId);
  }
}
