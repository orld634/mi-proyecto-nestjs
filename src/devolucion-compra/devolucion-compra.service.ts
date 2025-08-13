import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevolucionCompra, EstadoDevolucionCompra } from './entities/devolucion-compra.entity';
import { CreateDevolucionCompraDto } from './dto/create-devolucion-compra.dto';
import { UpdateDevolucionCompraDto } from './dto/update-devolucion-compra.dto';
import { User } from '../users/entities/user.entity';
import { Compra } from '../compra/entities/compra.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';

@Injectable()
export class DevolucionCompraService {
  constructor(
    @InjectRepository(DevolucionCompra)
    private devolucionCompraRepository: Repository<DevolucionCompra>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Compra)
    private compraRepository: Repository<Compra>,
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createDevolucionCompraDto: CreateDevolucionCompraDto): Promise<DevolucionCompra> {
    // Verificar que el usuario existe y es admin
    const usuario = await this.userRepository.findOne({
      where: { id: createDevolucionCompraDto.id_usuario }
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (usuario.role !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden crear devoluciones de compra');
    }

    // Verificar que la compra existe
    const compra = await this.compraRepository.findOne({
      where: { id_compra: createDevolucionCompraDto.id_compra }
    });

    if (!compra) {
      throw new NotFoundException('Compra no encontrada');
    }

    // Verificar que el proveedor existe
    const proveedor = await this.proveedorRepository.findOne({
      where: { id_proveedor: createDevolucionCompraDto.id_proveedor }
    });

    if (!proveedor) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    // Verificar que el proveedor de la devolución coincide con el de la compra
    if (compra.id_proveedor !== createDevolucionCompraDto.id_proveedor) {
      throw new BadRequestException('El proveedor de la devolución debe coincidir con el proveedor de la compra');
    }

    // Verificar que el monto de devolución no exceda el total de la compra
    if (createDevolucionCompraDto.monto_devuelto > compra.total_compra) {
      throw new BadRequestException('El monto de devolución no puede exceder el total de la compra');
    }

    const devolucionCompra = this.devolucionCompraRepository.create({
      ...createDevolucionCompraDto,
      fecha_devolucion: new Date(createDevolucionCompraDto.fecha_devolucion),
      estado: createDevolucionCompraDto.estado || EstadoDevolucionCompra.PENDIENTE
    });

    return await this.devolucionCompraRepository.save(devolucionCompra);
  }

  async findAll(): Promise<DevolucionCompra[]> {
    return await this.devolucionCompraRepository.find({
      relations: ['compra', 'usuario', 'proveedor'],
      order: { created_at: 'DESC' }
    });
  }

  async findByEstado(estado: EstadoDevolucionCompra): Promise<DevolucionCompra[]> {
    return await this.devolucionCompraRepository.find({
      where: { estado },
      relations: ['compra', 'usuario', 'proveedor'],
      order: { created_at: 'DESC' }
    });
  }

  async findByUsuario(id_usuario: number): Promise<DevolucionCompra[]> {
    const usuario = await this.userRepository.findOne({
      where: { id: id_usuario }
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return await this.devolucionCompraRepository.find({
      where: { id_usuario },
      relations: ['compra', 'usuario', 'proveedor'],
      order: { created_at: 'DESC' }
    });
  }

  async findByProveedor(id_proveedor: number): Promise<DevolucionCompra[]> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id_proveedor: id_proveedor }
    });

    if (!proveedor) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return await this.devolucionCompraRepository.find({
      where: { id_proveedor },
      relations: ['compra', 'usuario', 'proveedor'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<DevolucionCompra> {
    const devolucionCompra = await this.devolucionCompraRepository.findOne({
      where: { id_devolucion_compra: id },
      relations: ['compra', 'usuario', 'proveedor']
    });

    if (!devolucionCompra) {
      throw new NotFoundException('Devolución de compra no encontrada');
    }

    return devolucionCompra;
  }

  async update(id: number, updateDevolucionCompraDto: UpdateDevolucionCompraDto, usuarioId: number): Promise<DevolucionCompra> {
    const devolucionCompra = await this.findOne(id);

    // Verificar que el usuario que actualiza es admin
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId }
    });

    if (!usuario || usuario.role !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden actualizar devoluciones de compra');
    }

    // Si se está actualizando el monto, verificar que no exceda el total de la compra
    if (updateDevolucionCompraDto.monto_devuelto) {
      const compra = await this.compraRepository.findOne({
        where: { id_compra: devolucionCompra.id_compra }
      });

      // Verificar que la compra existe antes de acceder a sus propiedades
      if (!compra) {
        throw new NotFoundException('Compra asociada no encontrada');
      }

      if (updateDevolucionCompraDto.monto_devuelto > compra.total_compra) {
        throw new BadRequestException('El monto de devolución no puede exceder el total de la compra');
      }
    }

    // Actualizar fecha si se proporciona
    if (updateDevolucionCompraDto.fecha_devolucion) {
      updateDevolucionCompraDto.fecha_devolucion = new Date(updateDevolucionCompraDto.fecha_devolucion) as any;
    }

    await this.devolucionCompraRepository.update(id, updateDevolucionCompraDto);
    return await this.findOne(id);
  }

  async aprobar(id: number, usuarioId: number, observaciones?: string): Promise<DevolucionCompra> {
    const devolucionCompra = await this.findOne(id);

    if (devolucionCompra.estado !== EstadoDevolucionCompra.PENDIENTE) {
      throw new BadRequestException('Solo se pueden aprobar devoluciones con estado pendiente');
    }

    return await this.update(id, {
      estado: EstadoDevolucionCompra.APROBADA,
      observaciones: observaciones || devolucionCompra.observaciones
    }, usuarioId);
  }

  async rechazar(id: number, usuarioId: number, observaciones: string): Promise<DevolucionCompra> {
    const devolucionCompra = await this.findOne(id);

    if (devolucionCompra.estado !== EstadoDevolucionCompra.PENDIENTE) {
      throw new BadRequestException('Solo se pueden rechazar devoluciones con estado pendiente');
    }

    if (!observaciones) {
      throw new BadRequestException('Las observaciones son requeridas para rechazar una devolución');
    }

    return await this.update(id, {
      estado: EstadoDevolucionCompra.RECHAZADA,
      observaciones
    }, usuarioId);
  }

  async remove(id: number, usuarioId: number): Promise<void> {
    const devolucionCompra = await this.findOne(id);

    // Verificar que el usuario que elimina es admin
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId }
    });

    if (!usuario || usuario.role !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden eliminar devoluciones de compra');
    }

    // Solo permitir eliminar devoluciones pendientes
    if (devolucionCompra.estado !== EstadoDevolucionCompra.PENDIENTE) {
      throw new BadRequestException('Solo se pueden eliminar devoluciones con estado pendiente');
    }

    await this.devolucionCompraRepository.remove(devolucionCompra);
  }

  async getTotalDevoluciones(): Promise<{ total: number; por_estado: any }> {
    const total = await this.devolucionCompraRepository.count();
    const por_estado = await this.devolucionCompraRepository
      .createQueryBuilder('devolucion')
      .select('devolucion.estado', 'estado')
      .addSelect('COUNT(*)', 'cantidad')
      .addSelect('SUM(devolucion.monto_devuelto)', 'monto_total')
      .groupBy('devolucion.estado')
      .getRawMany();

    return { total, por_estado };
  }
}