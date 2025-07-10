import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta, EstadoVenta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    try {
      const venta = this.ventaRepository.create(createVentaDto);
      return await this.ventaRepository.save(venta);
    } catch (error) {
      throw new BadRequestException('Error al crear la venta');
    }
  }

  async findAll(): Promise<Venta[]> {
    return await this.ventaRepository.find({
      relations: ['usuario'],
      order: { fecha_venta: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id_venta: id },
      relations: ['usuario']
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return venta;
  }

  async findByUsuario(id_usuario: number): Promise<Venta[]> {
    return await this.ventaRepository.find({
      where: { id_usuario },
      relations: ['usuario'],
      order: { fecha_venta: 'DESC' }
    });
  }

  async findByEstado(estado: EstadoVenta): Promise<Venta[]> {
    return await this.ventaRepository.find({
      where: { estado },
      relations: ['usuario'],
      order: { fecha_venta: 'DESC' }
    });
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id);
    
    Object.assign(venta, updateVentaDto);
    
    try {
      return await this.ventaRepository.save(venta);
    } catch (error) {
      throw new BadRequestException('Error al actualizar la venta');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const venta = await this.findOne(id);
    
    await this.ventaRepository.remove(venta);
    
    return { message: `Venta con ID ${id} eliminada correctamente` };
  }

  async completarVenta(id: number): Promise<Venta> {
    const venta = await this.findOne(id);
    
    if (venta.estado === EstadoVenta.COMPLETADA) {
      throw new BadRequestException('La venta ya está completada');
    }
    
    venta.estado = EstadoVenta.COMPLETADA;
    
    return await this.ventaRepository.save(venta);
  }

  async getTotalVentas(): Promise<{ total: number; completadas: number; pendientes: number }> {
    const [total, completadas, pendientes] = await Promise.all([
      this.ventaRepository.count(),
      this.ventaRepository.count({ where: { estado: EstadoVenta.COMPLETADA } }),
      this.ventaRepository.count({ where: { estado: EstadoVenta.PENDIENTE } })
    ]);

    return { total, completadas, pendientes };
  }

  async getVentasPorPeriodo(fechaInicio: Date, fechaFin: Date): Promise<Venta[]> {
    return await this.ventaRepository.createQueryBuilder('venta')
      .leftJoinAndSelect('venta.usuario', 'usuario')
      .where('venta.fecha_venta >= :fechaInicio', { fechaInicio })
      .andWhere('venta.fecha_venta <= :fechaFin', { fechaFin })
      .orderBy('venta.fecha_venta', 'DESC')
      .getMany();
  }

  async getMontoTotalVentas(): Promise<{ totalGeneral: number; totalCompletadas: number; totalPendientes: number }> {
    const ventasCompletadas = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('SUM(venta.total_venta)', 'total')
      .where('venta.estado = :estado', { estado: EstadoVenta.COMPLETADA })
      .getRawOne();

    const ventasPendientes = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('SUM(venta.total_venta)', 'total')
      .where('venta.estado = :estado', { estado: EstadoVenta.PENDIENTE })
      .getRawOne();

    const totalGeneral = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('SUM(venta.total_venta)', 'total')
      .getRawOne();

    return {
      totalGeneral: parseFloat(totalGeneral.total) || 0,
      totalCompletadas: parseFloat(ventasCompletadas.total) || 0,
      totalPendientes: parseFloat(ventasPendientes.total) || 0
    };
  }
}