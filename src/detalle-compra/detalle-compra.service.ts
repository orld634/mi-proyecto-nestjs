import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetalleCompraDto } from './dto/create-detalle-compra.dto';
import { UpdateDetalleCompraDto } from './dto/update-detalle-compra.dto';
import { DetalleCompra } from './entities/detalle-compra.entity';

@Injectable()
export class DetalleCompraService {
  constructor(
    @InjectRepository(DetalleCompra)
    private detalleCompraRepository: Repository<DetalleCompra>,
  ) {}

  async create(createDetalleCompraDto: CreateDetalleCompraDto): Promise<DetalleCompra> {
    // Validar que el subtotal sea correcto
    const subtotalCalculado = createDetalleCompraDto.cantidad * createDetalleCompraDto.precio_unitario;
    if (Math.abs(subtotalCalculado - createDetalleCompraDto.subtotal) > 0.01) {
      throw new BadRequestException('El subtotal no coincide con cantidad * precio_unitario');
    }

    const detalleCompra = this.detalleCompraRepository.create(createDetalleCompraDto);
    return await this.detalleCompraRepository.save(detalleCompra);
  }

  async findAll(): Promise<DetalleCompra[]> {
    return await this.detalleCompraRepository.find({
      relations: ['compra', 'producto'],
    });
  }

  async findOne(id: number): Promise<DetalleCompra> {
    const detalleCompra = await this.detalleCompraRepository.findOne({
      where: { id_detalle_compra: id },
      relations: ['compra', 'producto'],
    });

    if (!detalleCompra) {
      throw new NotFoundException(`Detalle de compra con ID ${id} no encontrado`);
    }

    return detalleCompra;
  }

  async findByCompra(idCompra: number): Promise<DetalleCompra[]> {
    return await this.detalleCompraRepository.find({
      where: { id_compra: idCompra },
      relations: ['producto'],
    });
  }

  async update(id: number, updateDetalleCompraDto: UpdateDetalleCompraDto): Promise<DetalleCompra> {
    const detalleCompra = await this.findOne(id);
    
    // Si se están actualizando cantidad, precio_unitario o subtotal, validar consistencia
    if (updateDetalleCompraDto.cantidad !== undefined || 
        updateDetalleCompraDto.precio_unitario !== undefined || 
        updateDetalleCompraDto.subtotal !== undefined) {
      
      const cantidad = updateDetalleCompraDto.cantidad ?? detalleCompra.cantidad;
      const precioUnitario = updateDetalleCompraDto.precio_unitario ?? detalleCompra.precio_unitario;
      const subtotal = updateDetalleCompraDto.subtotal ?? detalleCompra.subtotal;
      
      const subtotalCalculado = cantidad * precioUnitario;
      if (Math.abs(subtotalCalculado - subtotal) > 0.01) {
        throw new BadRequestException('El subtotal no coincide con cantidad * precio_unitario');
      }
    }
    
    Object.assign(detalleCompra, updateDetalleCompraDto);
    
    return await this.detalleCompraRepository.save(detalleCompra);
  }

  async remove(id: number): Promise<void> {
    const detalleCompra = await this.findOne(id);
    await this.detalleCompraRepository.remove(detalleCompra);
  }

  async removeByCompra(idCompra: number): Promise<void> {
    await this.detalleCompraRepository.delete({ id_compra: idCompra });
  }

  async calculateTotalCompra(idCompra: number): Promise<number> {
    const detalles = await this.findByCompra(idCompra);
    return detalles.reduce((total, detalle) => total + Number(detalle.subtotal), 0);
  }
}