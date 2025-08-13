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

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }

  @Get()
  findAll() {
    return this.categoriaService.findAll();
  }

  @Get('active')
  findAllActive() {
    return this.categoriaService.findAllActive();
  }

  @Get('with-count')
  findAllWithCount() {
    return this.categoriaService.getCategoriasWithProductCount();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriaService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.remove(id);
  }

  @Patch(':id/aprobar')
  aprobar(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.aprobar(id);
  }

  @Patch(':id/rechazar')
  rechazar(@Param('id', ParseIntPipe) id: number) {
    return this.categoriaService.rechazar(id);
  }
}
