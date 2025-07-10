import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post('create')
  create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedoresService.create(createProveedorDto);
  }

  @Get()
  findAll() {
    return this.proveedoresService.findAll();
  }

  @Get('search')
  searchByNombre(@Query('nombre') nombre: string) {
    return this.proveedoresService.searchByNombre(nombre);
  }

  @Get('pais/:pais')
  findByPais(@Param('pais') pais: string) {
    return this.proveedoresService.findByPais(pais);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.proveedoresService.findByEmail(email);
  }

  @Get('ruc-nit/:rucNit')
  findByRucNit(@Param('rucNit') rucNit: string) {
    return this.proveedoresService.findByRucNit(rucNit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProveedorDto: UpdateProveedorDto
  ) {
    return this.proveedoresService.update(id, updateProveedorDto);
  }

  @Patch(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.activate(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.remove(id);
  }

  @Delete(':id/hard')
  hardDelete(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.hardDelete(id);
  }
}