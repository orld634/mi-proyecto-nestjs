import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarritoCompra } from './entities/carrito-compra.entity';
import { CreateCarritoCompraDto } from './dto/create-carrito-compra.dto';
import { UpdateCarritoCompraDto } from './dto/update-carrito-compra.dto';

@Injectable()
export class CarritoCompraService {
  constructor(
    @InjectRepository(CarritoCompra)
    private readonly carritoCompraRepository: Repository<CarritoCompra>,
  ) {}

  async create(createCarritoCompraDto: CreateCarritoCompraDto): Promise<CarritoCompra> {
    const carritoCompra = this.carritoCompraRepository.create(createCarritoCompraDto);
    return await this.carritoCompraRepository.save(carritoCompra);
  }

  async findAll(): Promise<CarritoCompra[]> {
    return await this.carritoCompraRepository.find({
      relations: ['usuario']
    });
  }

  async findOne(id: number): Promise<CarritoCompra> {
    const carritoCompra = await this.carritoCompraRepository.findOne({
      where: { id },
      relations: ['usuario']
    });
    
    if (!carritoCompra) {
      throw new NotFoundException('carrito de compra con ID' + {id} + 'no encontrado')
    }
    
    return carritoCompra;
  }

  async findByUsuario(idUsuario: number): Promise<CarritoCompra[]> {
    return await this.carritoCompraRepository.find({
      where: { idUsuario },
      relations: ['usuario']
    });
  }

  async findCarritoActivoByUsuario(idUsuario: number): Promise<CarritoCompra> {
    const carritoActivo = await this.carritoCompraRepository.findOne({
      where: { 
        idUsuario, 
        estado: 'activo' 
      },
      relations: ['usuario']
    });

    if (!carritoActivo) {
      // Si no existe un carrito activo, crear uno nuevo
      const nuevoCarrito = await this.create({
        idUsuario,
        estado: 'activo',
        subtotal: 0
      });
      return nuevoCarrito;
    }

    return carritoActivo;
  }

  async update(id: number, updateCarritoCompraDto: UpdateCarritoCompraDto): Promise<CarritoCompra> {
    const carritoCompra = await this.findOne(id);
    
    Object.assign(carritoCompra, updateCarritoCompraDto);
    
    return await this.carritoCompraRepository.save(carritoCompra);
  }

  async updateSubtotal(id: number, nuevoSubtotal: number): Promise<CarritoCompra> {
    const carritoCompra = await this.findOne(id);
    carritoCompra.subtotal = nuevoSubtotal;
    return await this.carritoCompraRepository.save(carritoCompra);
  }

  async remove(id: number): Promise<void> {
    const carritoCompra = await this.findOne(id);
    await this.carritoCompraRepository.remove(carritoCompra);
  }

  async desactivarCarrito(id: number): Promise<CarritoCompra> {
    const carritoCompra = await this.findOne(id);
    carritoCompra.estado = 'inactivo';
    return await this.carritoCompraRepository.save(carritoCompra);
  }
}