import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    try {
      const producto = this.productoRepository.create(createProductoDto);
      return await this.productoRepository.save(producto);
    } catch (error) {
      if (error.code === '23505') { // Código de error para violación de unique constraint
        throw new ConflictException('El código de barras ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id_producto: id, activo: true }
    });
    
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    
    return producto;
  }

  async findByCodigoBarras(codigoBarras: string): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { codigo_barras: codigoBarras, activo: true }
    });
    
    if (!producto) {
      throw new NotFoundException(`Producto con código de barras ${codigoBarras} no encontrado`);
    }
    
    return producto;
  }

  async findByCategoria(idCategoria: number): Promise<Producto[]> {
    return await this.productoRepository.find({
      where: { id_categoria: idCategoria, activo: true },
      order: { nombre: 'ASC' }
    });
  }

  async findProductosConStockBajo(): Promise<Producto[]> {
    return await this.productoRepository
      .createQueryBuilder('producto')
      .where('producto.stock_actual <= producto.stock_minimo')
      .andWhere('producto.activo = :activo', { activo: true })
      .orderBy('producto.nombre', 'ASC')
      .getMany();
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    
    try {
      Object.assign(producto, updateProductoDto);
      return await this.productoRepository.save(producto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El código de barras ya existe');
      }
      throw error;
    }
  }

  async updateStock(id: number, nuevoStock: number): Promise<Producto> {
    const producto = await this.findOne(id);
    producto.stock_actual = nuevoStock;
    return await this.productoRepository.save(producto);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    producto.activo = false;
    await this.productoRepository.save(producto);
  }

  async hardDelete(id: number): Promise<void> {
    const resultado = await this.productoRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
  }
}