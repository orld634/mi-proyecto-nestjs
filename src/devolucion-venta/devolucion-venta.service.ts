import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevolucionVenta, EstadoDevolucion } from './entities/devolucion-venta.entity';
import { CreateDevolucionVentaDto } from './dto/create-devolucion-venta.dto';
import { UpdateDevolucionVentaDto } from './dto/update-devolucion-venta.dto';
import { Venta } from '../venta/entities/venta.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DevolucionVentaService {
  constructor(
    @InjectRepository(DevolucionVenta)
    private readonly devolucionVentaRepository: Repository<DevolucionVenta>,
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDevolucionVentaDto: CreateDevolucionVentaDto): Promise<DevolucionVenta> {
    // Verificar que la venta existe
    const venta = await this.ventaRepository.findOne({
      where: { id_venta: createDevolucionVentaDto.id_venta }
    });
    if (!venta) {
      throw new NotFoundException('Venta no encontrada');
    }

    // Verificar que el usuario existe
    const usuario = await this.userRepository.findOne({
      where: { id: createDevolucionVentaDto.id_usuario }
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el monto de devolución no exceda el total de la venta
    if (createDevolucionVentaDto.monto_devuelto > Number(venta.total_venta)) {
      throw new BadRequestException('El monto de devolución no puede exceder el total de la venta');
    }

    // Verificar que no existe ya una devolución pendiente o aprobada para esta venta
    const devolucionExistente = await this.devolucionVentaRepository.findOne({
      where: {
        id_venta: createDevolucionVentaDto.id_venta,
        estado: EstadoDevolucion.PENDIENTE || EstadoDevolucion.APROBADA
      }
    });

    if (devolucionExistente) {
      throw new BadRequestException('Ya existe una devolución pendiente o aprobada para esta venta');
    }

    const devolucion = this.devolucionVentaRepository.create({
      ...createDevolucionVentaDto,
      estado: createDevolucionVentaDto.estado || EstadoDevolucion.PENDIENTE
    });

    return await this.devolucionVentaRepository.save(devolucion);
  }

  async findAll(): Promise<DevolucionVenta[]> {
    return await this.devolucionVentaRepository.find({
      relations: ['usuario', 'venta'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<DevolucionVenta> {
    const devolucion = await this.devolucionVentaRepository.findOne({
      where: { id_devolucion: id },
      relations: ['usuario', 'venta']
    });

    if (!devolucion) {
      throw new NotFoundException('Devolución no encontrada');
    }

    return devolucion;
  }

  async findByUser(userId: number): Promise<DevolucionVenta[]> {
    return await this.devolucionVentaRepository.find({
      where: { id_usuario: userId },
      relations: ['usuario', 'venta'],
      order: { created_at: 'DESC' }
    });
  }

  async findByVenta(ventaId: number): Promise<DevolucionVenta[]> {
    return await this.devolucionVentaRepository.find({
      where: { id_venta: ventaId },
      relations: ['usuario', 'venta'],
      order: { created_at: 'DESC' }
    });
  }

  async findByEstado(estado: EstadoDevolucion): Promise<DevolucionVenta[]> {
    return await this.devolucionVentaRepository.find({
      where: { estado },
      relations: ['usuario', 'venta'],
      order: { created_at: 'DESC' }
    });
  }

  async update(id: number, updateDevolucionVentaDto: UpdateDevolucionVentaDto): Promise<DevolucionVenta> {
    const devolucion = await this.findOne(id);

    // Si se está actualizando el monto y existe una venta asociada, validar
    if (updateDevolucionVentaDto.monto_devuelto && devolucion.venta) {
      if (updateDevolucionVentaDto.monto_devuelto > Number(devolucion.venta.total_venta)) {
        throw new BadRequestException('El monto de devolución no puede exceder el total de la venta');
      }
    }

    Object.assign(devolucion, updateDevolucionVentaDto);
    return await this.devolucionVentaRepository.save(devolucion);
  }

  async aprobar(id: number, observaciones?: string): Promise<DevolucionVenta> {
    const devolucion = await this.findOne(id);
    
    if (devolucion.estado !== EstadoDevolucion.PENDIENTE) {
      throw new BadRequestException('Solo se pueden aprobar devoluciones pendientes');
    }

    devolucion.estado = EstadoDevolucion.APROBADA;
    if (observaciones) {
      devolucion.observaciones = observaciones;
    }

    return await this.devolucionVentaRepository.save(devolucion);
  }

  async rechazar(id: number, observaciones: string): Promise<DevolucionVenta> {
    const devolucion = await this.findOne(id);
    
    if (devolucion.estado !== EstadoDevolucion.PENDIENTE) {
      throw new BadRequestException('Solo se pueden rechazar devoluciones pendientes');
    }

    devolucion.estado = EstadoDevolucion.RECHAZADA;
    devolucion.observaciones = observaciones;

    return await this.devolucionVentaRepository.save(devolucion);
  }

  async remove(id: number): Promise<void> {
    const devolucion = await this.findOne(id);
    await this.devolucionVentaRepository.remove(devolucion);
  }

  // Método para obtener estadísticas de devoluciones
  async getEstadisticas() {
    const total = await this.devolucionVentaRepository.count();
    const pendientes = await this.devolucionVentaRepository.count({
      where: { estado: EstadoDevolucion.PENDIENTE }
    });
    const aprobadas = await this.devolucionVentaRepository.count({
      where: { estado: EstadoDevolucion.APROBADA }
    });
    const rechazadas = await this.devolucionVentaRepository.count({
      where: { estado: EstadoDevolucion.RECHAZADA }
    });

    const montoTotalDevuelto = await this.devolucionVentaRepository
      .createQueryBuilder('devolucion')
      .select('SUM(devolucion.monto_devuelto)', 'total')
      .where('devolucion.estado = :estado', { estado: EstadoDevolucion.APROBADA })
      .getRawOne();

    return {
      total,
      pendientes,
      aprobadas,
      rechazadas,
      montoTotalDevuelto: montoTotalDevuelto?.total || 0
    };
  }
}