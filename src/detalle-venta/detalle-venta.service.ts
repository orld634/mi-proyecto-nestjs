import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';
import { DetalleVenta } from './entities/detalle-venta.entity';

@Injectable()
export class DetalleVentaService {
  constructor(
    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,
  ) {}

  async create(createDetalleVentaDto: CreateDetalleVentaDto): Promise<DetalleVenta> {
    const detalleVenta = this.detalleVentaRepository.create(createDetalleVentaDto);
    return await this.detalleVentaRepository.save(detalleVenta);
  }

  async findAll(): Promise<DetalleVenta[]> {
    return await this.detalleVentaRepository.find({
      relations: ['venta', 'producto'],
      order: { fecha_creacion: 'DESC' }
    });
  }

  async findOne(id: number): Promise<DetalleVenta> {
    const detalleVenta = await this.detalleVentaRepository.findOne({
      where: { id_detalle_venta: id },
      relations: ['venta', 'producto']
    });

    if (!detalleVenta) {
      throw new NotFoundException(`Detalle de venta con ID ${id} no encontrado`);
    }

    return detalleVenta;
  }

  async findByVenta(id_venta: number): Promise<DetalleVenta[]> {
    return await this.detalleVentaRepository.find({
      where: { id_venta },
      relations: ['venta', 'producto'],
      order: { fecha_creacion: 'DESC' }
    });
  }

  async findByProducto(id_producto: number): Promise<DetalleVenta[]> {
    return await this.detalleVentaRepository.find({
      where: { id_producto },
      relations: ['venta', 'producto'],
      order: { fecha_creacion: 'DESC' }
    });
  }

  async update(id: number, updateDetalleVentaDto: UpdateDetalleVentaDto): Promise<DetalleVenta> {
    const detalleVenta = await this.findOne(id);
    
    Object.assign(detalleVenta, updateDetalleVentaDto);
    
    return await this.detalleVentaRepository.save(detalleVenta);
  }

  async remove(id: number): Promise<void> {
    const detalleVenta = await this.findOne(id);
    await this.detalleVentaRepository.remove(detalleVenta);
  }

  async removeByVenta(id_venta: number): Promise<void> {
    await this.detalleVentaRepository.delete({ id_venta });
  }
}