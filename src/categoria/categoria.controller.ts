import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  // CREAR CATEGORÍA
  @Post('create')
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }

  // OBTENER TODAS LAS CATEGORÍAS CON SUS PRODUCTOS
  @Get()
  async findAllWithProducts() {
    const categorias = await this.categoriaService.findAllWithProducts();

    return categorias.map(cat => ({
      id: cat.id_categoria,
      nombre: cat.nombre,
      descripcion: cat.descripcion || '',
      productos: (cat.productos || []).map(p => ({
        id: p.id_producto,
        nombre: p.nombre,
        marca: p.marca || '',
        precio_venta: p.precio_venta || 0,
        stock_actual: p.stock_actual || 0,
        imagen_url: p.imagen_url || 'https://via.placeholder.com/150',
        codigo_barras: p.codigo_barras || '',
      })),
    }));
  }

  // CATEGORÍAS ACTIVAS (opcional)
  @Get('active')
  findAllActive() {
    return this.categoriaService.findAllActive();
  }

  // CON CONTEO DE PRODUCTOS (opcional, si aún lo usas)
  @Get('with-count')
  findAllWithCount() {
    return this.categoriaService.getCategoriasWithProductCount();
  }

  // OBTENER UNA CATEGORÍA
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.findOne(id);
  }

  // ACTUALIZAR
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriaService.update(id, updateCategoriaDto);
  }

  // ELIMINAR
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.remove(id);
  }

  // APROBAR / RECHAZAR
  @Patch(':id/aprobar')
  aprobar(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.aprobar(id);
  }

  @Patch(':id/rechazar')
  rechazar(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.rechazar(id);
  }
}