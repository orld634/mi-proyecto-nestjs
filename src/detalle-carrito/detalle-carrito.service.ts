import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleCarrito } from '../detalle-carrito/entities/detalle-carrito.entity';

@Injectable()
export class DetalleCarritoService {
  constructor(
    @InjectRepository(DetalleCarrito)
    private detalleCarritoRepository: Repository<DetalleCarrito>,
  ) {}

  async create(detalleCarritoData: Partial<DetalleCarrito>): Promise<DetalleCarrito> {
    // Calcular subtotal automáticamente
    if (detalleCarritoData.cantidad && detalleCarritoData.precioUnitario) {
      detalleCarritoData.subtotal = detalleCarritoData.cantidad * detalleCarritoData.precioUnitario;
    }
    
    const detalleCarrito = this.detalleCarritoRepository.create(detalleCarritoData);
    return await this.detalleCarritoRepository.save(detalleCarrito);
  }

  async findAll(): Promise<DetalleCarrito[]> {
    return await this.detalleCarritoRepository.find({
      relations: ['carritoCompra', 'producto']
    });
  }

  async findOne(id: number): Promise<DetalleCarrito> {
    const detalleCarrito = await this.detalleCarritoRepository.findOne({
      where: { id },
      relations: ['carritoCompra', 'producto']
    });

    if (!detalleCarrito) {
      throw new NotFoundException('Detalle de carrito con ID' + {id} + 'no encontrado');
    }

    return detalleCarrito;
  }

  async findByCarritoId(idCarritoCompra: number): Promise<DetalleCarrito[]> {
    return await this.detalleCarritoRepository.find({
      where: { idCarritoCompra },
      relations: ['producto']
    });
  }

  async update(id: number, updateData: Partial<DetalleCarrito>): Promise<DetalleCarrito> {
    const detalleCarrito = await this.findOne(id);
    
    // Recalcular subtotal si cambia cantidad o precio unitario
    if (updateData.cantidad || updateData.precioUnitario) {
      const cantidad = updateData.cantidad || detalleCarrito.cantidad;
      const precioUnitario = updateData.precioUnitario || detalleCarrito.precioUnitario;
      updateData.subtotal = cantidad * precioUnitario;
    }

    Object.assign(detalleCarrito, updateData);
    return await this.detalleCarritoRepository.save(detalleCarrito);
  }

  async remove(id: number): Promise<void> {
    const detalleCarrito = await this.findOne(id);
    await this.detalleCarritoRepository.remove(detalleCarrito);
  }

  async removeByCarritoId(idCarritoCompra: number): Promise<void> {
    await this.detalleCarritoRepository.delete({ idCarritoCompra });
  }
}