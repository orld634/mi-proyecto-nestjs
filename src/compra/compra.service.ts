import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Compra, EstadoCompra } from '../compra/entities/compra.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { User } from '../users/entities/user.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';

@Injectable()
export class CompraService {
  constructor(
    @InjectRepository(Compra)
    private compraRepository: Repository<Compra>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createCompraDto: CreateCompraDto, userId: number): Promise<Compra> {
    // Verificar que el usuario sea admin
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden crear compras');
    }

    // Verificar que el proveedor existe y está activo
    const proveedor = await this.proveedorRepository.findOne({ 
      where: { id_proveedor: createCompraDto.id_proveedor } 
    });
    if (!proveedor || !proveedor.activo) {
      throw new BadRequestException('El proveedor no existe o está inactivo');
    }

    try {
      const compra = this.compraRepository.create({
        ...createCompraDto,
        id_usuario: userId
      });
      return await this.compraRepository.save(compra);
    } catch (error) {
      if (error.code === '23505') { // Duplicate key error
        throw new BadRequestException('El número de orden ya existe');
      }
      throw error;
    }
  }

  async findAll(filters?: {
    estado?: string;
    proveedor?: number;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<Compra[]> {
    const queryBuilder = this.compraRepository.createQueryBuilder('compra')
      .leftJoinAndSelect('compra.proveedor', 'proveedor')
      .leftJoinAndSelect('compra.usuario', 'usuario');

    if (filters?.estado) {
      queryBuilder.andWhere('compra.estado = :estado', { estado: filters.estado });
    }

    if (filters?.proveedor) {
      queryBuilder.andWhere('compra.id_proveedor = :proveedor', { proveedor: filters.proveedor });
    }

    if (filters?.fechaDesde && filters?.fechaHasta) {
      queryBuilder.andWhere('compra.fecha_compra BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde: filters.fechaDesde,
        fechaHasta: filters.fechaHasta
      });
    }

    return await queryBuilder.orderBy('compra.fecha_compra', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Compra> {
    const compra = await this.compraRepository.findOne({
      where: { id_compra: id },
      relations: ['proveedor', 'usuario']
    });

    if (!compra) {
      throw new NotFoundException(`Compra con ID ${id} no encontrada`);
    }

    return compra;
  }

  async update(id: number, updateCompraDto: UpdateCompraDto, userId: number): Promise<Compra> {
    const compra = await this.findOne(id);
    
    // Verificar que el usuario sea admin
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden actualizar compras');
    }

    // Si se está actualizando el proveedor, verificar que existe y está activo
    if (updateCompraDto.id_proveedor) {
      const proveedor = await this.proveedorRepository.findOne({ 
        where: { id_proveedor: updateCompraDto.id_proveedor } 
      });
      if (!proveedor || !proveedor.activo) {
        throw new BadRequestException('El proveedor no existe o está inactivo');
      }
    }
    
    try {
      Object.assign(compra, updateCompraDto);
      return await this.compraRepository.save(compra);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('El número de orden ya existe');
      }
      throw error;
    }
  }

  async remove(id: number, userId: number): Promise<void> {
    const compra = await this.findOne(id);
    
    // Verificar que el usuario sea admin
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden eliminar compras');
    }

    await this.compraRepository.remove(compra);
  }

  async updateEstado(id: number, estado: string, userId: number): Promise<Compra> {
    const compra = await this.findOne(id);
    
    // Verificar que el usuario sea admin
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden actualizar el estado de las compras');
    }
    
    if (!Object.values(EstadoCompra).includes(estado as EstadoCompra)) {
      throw new BadRequestException('Estado no válido');
    }

    compra.estado = estado as EstadoCompra;
    return await this.compraRepository.save(compra);
  }

  async findByProveedor(idProveedor: number): Promise<Compra[]> {
    return await this.compraRepository.find({
      where: { id_proveedor: idProveedor },
      relations: ['proveedor', 'usuario'],
      order: { fecha_compra: 'DESC' }
    });
  }

  async findByUsuario(idUsuario: number): Promise<Compra[]> {
    return await this.compraRepository.find({
      where: { id_usuario: idUsuario },
      relations: ['proveedor', 'usuario'],
      order: { fecha_compra: 'DESC' }
    });
  }

  async getTotalComprasPorEstado(): Promise<any> {
    return await this.compraRepository
      .createQueryBuilder('compra')
      .select('compra.estado, COUNT(*) as total, SUM(compra.total_compra) as monto_total')
      .groupBy('compra.estado')
      .getRawMany();
  }

  async getComprasPorAdmin(): Promise<any> {
    return await this.compraRepository
      .createQueryBuilder('compra')
      .leftJoin('compra.usuario', 'usuario')
      .select([
        'usuario.nombre',
        'usuario.apellido',
        'COUNT(compra.id_compra) as total_compras',
        'SUM(compra.total_compra) as monto_total'
      ])
      .where('usuario.role = :role', { role: 'admin' })
      .groupBy('usuario.id, usuario.nombre, usuario.apellido')
      .getRawMany();
  }
}