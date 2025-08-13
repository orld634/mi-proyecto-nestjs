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
  searchByNombreEmpresa(@Query('nombre_empresa') nombre_empresa: string) {
    return this.proveedoresService.searchByNombreEmpresa(nombre_empresa);
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

  @Get('contacto/:contacto')
  findByContacto(@Param('contacto') contacto: string) {
    return this.proveedoresService.findByContacto(contacto);
  }

  @Get('telefono/:telefono')
  findByTelefono(@Param('telefono') telefono: string) {
    return this.proveedoresService.findByTelefono(telefono);
  }

  @Get(':id_proveedor')
  findOne(@Param('id_proveedor', ParseIntPipe) id_proveedor: number) {
    return this.proveedoresService.findOne(id_proveedor);
  }

  @Patch(':id_proveedor')
  update(
    @Param('id_proveedor', ParseIntPipe) id_proveedor: number, 
    @Body() updateProveedorDto: UpdateProveedorDto
  ) {
    return this.proveedoresService.update(id_proveedor, updateProveedorDto);
  }

  @Patch(':id_proveedor/activate')
  activate(@Param('id_proveedor', ParseIntPipe) id_proveedor: number) {
    return this.proveedoresService.activate(id_proveedor);
  }

  @Patch(':id_proveedor/deactivate')
  deactivate(@Param('id_proveedor', ParseIntPipe) id_proveedor: number) {
    return this.proveedoresService.deactivate(id_proveedor);
  }

  @Delete(':id_proveedor')
  remove(@Param('id_proveedor', ParseIntPipe) id_proveedor: number) {
    return this.proveedoresService.remove(id_proveedor);
  }

  @Delete(':id_proveedor/hard')
  hardDelete(@Param('id_proveedor', ParseIntPipe) id_proveedor: number) {
    return this.proveedoresService.hardDelete(id_proveedor);
  }
}