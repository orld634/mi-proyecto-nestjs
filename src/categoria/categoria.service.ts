// src/categoria/categoria.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  // ==================== CREAR CATEGORÍA ====================
  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    try {
      const existingCategoria = await this.categoriaRepository.findOne({
        where: { nombre: createCategoriaDto.nombre }
      });

      if (existingCategoria) {
        throw new BadRequestException(`Ya existe una categoría con el nombre "${createCategoriaDto.nombre}"`);
      }

      const categoria = this.categoriaRepository.create(createCategoriaDto);
      const savedCategoria = await this.categoriaRepository.save(categoria);
    console.log('Respuesta del backend en create:', savedCategoria); // Agrega aquí el console.log

    return savedCategoria;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear la categoría');
    }
  }

  // ==================== LISTAR TODAS (SIN PRODUCTOS) ====================
  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      order: { nombre: 'ASC' }
    });
  }

  // ==================== LISTAR ACTIVAS ====================
  async findAllActive(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' }
    });
  }

  // ==================== NUEVO: LISTAR CON PRODUCTOS COMPLETOS ====================
  async findAllWithProducts(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      relations: ['productos'],
      where: { activo: true },
      order: { nombre: 'ASC' },
      select: {
        id_categoria: true,
        nombre: true,
        descripcion: true,
        activo: true,
        created_at: true,
        updated_at: true,
        productos: {
          id_producto: true,
          nombre: true,
          marca: true,
          precio_venta: true,
          stock_actual: true,
          imagen_url: true,
          codigo_barras: true,
          activo: true,
        }
      }
    });
  }

  // ==================== BUSCAR UNA CATEGORÍA ====================
  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id_categoria: id },
      relations: ['productos']
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
  }

  // ==================== ACTUALIZAR CATEGORÍA ====================
  async update(id: number, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.findOne(id);

    if (updateCategoriaDto.nombre && updateCategoriaDto.nombre !== categoria.nombre) {
      const existingCategoria = await this.categoriaRepository.findOne({
        where: { nombre: updateCategoriaDto.nombre }
      });

      if (existingCategoria) {
        throw new BadRequestException(`Ya existe una categoría con el nombre "${updateCategoriaDto.nombre}"`);
      }
    }

    Object.assign(categoria, updateCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  // ==================== ELIMINAR CATEGORÍA ====================
  async remove(id: number): Promise<void> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id_categoria: id },
      relations: ['productos']
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    if (categoria.productos && categoria.productos.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar la categoría porque tiene ${categoria.productos.length} producto(s) asociado(s)`
      );
    }

    await this.categoriaRepository.remove(categoria);
  }

  // ==================== APROBAR / RECHAZAR ====================
  async aprobar(id: number): Promise<Categoria> {
    const categoria = await this.findOne(id);
    categoria.activo = true;
    return await this.categoriaRepository.save(categoria);
  }

  async rechazar(id: number): Promise<Categoria> {
    const categoria = await this.findOne(id);
    categoria.activo = false;
    return await this.categoriaRepository.save(categoria);
  }

  // ==================== CON CONTEO DE PRODUCTOS (SQL) ====================
  async getCategoriasWithProductCount(): Promise<any[]> {
    return await this.categoriaRepository
      .createQueryBuilder('categoria')
      .leftJoin('categoria.productos', 'producto')
      .select([
        'categoria.id_categoria',
        'categoria.nombre',
        'categoria.descripcion',
        'categoria.activo',
        'categoria.created_at',
        'categoria.updated_at'
      ])
      .addSelect('COUNT(producto.id_producto)', 'total_productos')
      .groupBy('categoria.id_categoria')
      .orderBy('categoria.nombre', 'ASC')
      .getRawMany()
      .then(results => 
        results.map(result => ({
          ...result,
          total_productos: parseInt(result.total_productos) || 0
        }))
      );
  }
}