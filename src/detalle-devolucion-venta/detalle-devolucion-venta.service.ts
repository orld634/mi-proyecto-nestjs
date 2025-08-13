import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleDevolucionVenta, EstadoProductoDevolucion } from './entities/detalle-devolucion-venta.entity';
import { CreateDetalleDevolucionVentaDto } from './dto/create-detalle-devolucion-venta.dto';
import { UpdateDetalleDevolucionVentaDto } from './dto/update-detalle-devolucion-venta.dto';
import { DevolucionVenta, EstadoDevolucion } from '../devolucion-venta/entities/devolucion-venta.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class DetalleDevolucionVentaService {
  constructor(
    @InjectRepository(DetalleDevolucionVenta)
    private readonly detalleDevolucionRepository: Repository<DetalleDevolucionVenta>,
    @InjectRepository(DevolucionVenta)
    private readonly devolucionVentaRepository: Repository<DevolucionVenta>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createDetalleDevolucionDto: CreateDetalleDevolucionVentaDto): Promise<DetalleDevolucionVenta> {
    // Verificar que la devolución existe
    const devolucion = await this.devolucionVentaRepository.findOne({
      where: { id_devolucion: createDetalleDevolucionDto.id_devolucion_venta }
    });
    if (!devolucion) {
      throw new NotFoundException('Devolución de venta no encontrada');
    }

    // Verificar que la devolución esté pendiente (solo se pueden agregar detalles a devoluciones pendientes)
    if (devolucion.estado !== EstadoDevolucion.PENDIENTE) {
      throw new BadRequestException('Solo se pueden agregar detalles a devoluciones pendientes');
    }

    // Verificar que el producto existe
    const producto = await this.productoRepository.findOne({
      where: { id_producto: createDetalleDevolucionDto.id_producto }
    });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Validar que el subtotal sea correcto
    const subtotalCalculado = createDetalleDevolucionDto.unidades_devueltas * createDetalleDevolucionDto.precio_unitario;
    if (Math.abs(subtotalCalculado - createDetalleDevolucionDto.subtotal_devolucion) > 0.01) {
      throw new BadRequestException('El subtotal no coincide con el cálculo: unidades * precio unitario');
    }

    // Verificar que no exista ya un detalle para este producto en esta devolución
    const detalleExistente = await this.detalleDevolucionRepository.findOne({
      where: {
        id_devolucion_venta: createDetalleDevolucionDto.id_devolucion_venta,
        id_producto: createDetalleDevolucionDto.id_producto
      }
    });

    if (detalleExistente) {
      throw new BadRequestException('Ya existe un detalle para este producto en esta devolución');
    }

    const detalleDevolucion = this.detalleDevolucionRepository.create({
      ...createDetalleDevolucionDto,
      estado_producto: createDetalleDevolucionDto.estado_producto || EstadoProductoDevolucion.USADO
    });

    return await this.detalleDevolucionRepository.save(detalleDevolucion);
  }

  async findAll(): Promise<DetalleDevolucionVenta[]> {
    return await this.detalleDevolucionRepository.find({
      relations: ['devolucionVenta', 'producto'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<DetalleDevolucionVenta> {
    const detalle = await this.detalleDevolucionRepository.findOne({
      where: { id_detalle_devolucion: id },
      relations: ['devolucionVenta', 'producto']
    });

    if (!detalle) {
      throw new NotFoundException('Detalle de devolución no encontrado');
    }

    return detalle;
  }

  async findByDevolucion(devolucionId: number): Promise<DetalleDevolucionVenta[]> {
    return await this.detalleDevolucionRepository.find({
      where: { id_devolucion_venta: devolucionId },
      relations: ['devolucionVenta', 'producto'],
      order: { created_at: 'ASC' }
    });
  }

  async findByProducto(productoId: number): Promise<DetalleDevolucionVenta[]> {
    return await this.detalleDevolucionRepository.find({
      where: { id_producto: productoId },
      relations: ['devolucionVenta', 'producto'],
      order: { created_at: 'DESC' }
    });
  }

  async findByEstadoProducto(estado: EstadoProductoDevolucion): Promise<DetalleDevolucionVenta[]> {
    return await this.detalleDevolucionRepository.find({
      where: { estado_producto: estado },
      relations: ['devolucionVenta', 'producto'],
      order: { created_at: 'DESC' }
    });
  }

  async update(id: number, updateDetalleDevolucionDto: UpdateDetalleDevolucionVentaDto): Promise<DetalleDevolucionVenta> {
    const detalle = await this.findOne(id);

    // Verificar que la devolución esté pendiente
    if (detalle.devolucionVenta.estado !== EstadoDevolucion.PENDIENTE) {
      throw new BadRequestException('Solo se pueden modificar detalles de devoluciones pendientes');
    }

    // Si se están actualizando unidades o precio, recalcular subtotal
    if (updateDetalleDevolucionDto.unidades_devueltas || updateDetalleDevolucionDto.precio_unitario) {
      const unidades = updateDetalleDevolucionDto.unidades_devueltas || detalle.unidades_devueltas;
      const precio = updateDetalleDevolucionDto.precio_unitario || detalle.precio_unitario;
      
      if (updateDetalleDevolucionDto.subtotal_devolucion) {
        const subtotalCalculado = unidades * precio;
        if (Math.abs(subtotalCalculado - updateDetalleDevolucionDto.subtotal_devolucion) > 0.01) {
          throw new BadRequestException('El subtotal no coincide con el cálculo: unidades * precio unitario');
        }
      } else {
        updateDetalleDevolucionDto.subtotal_devolucion = unidades * precio;
      }
    }

    Object.assign(detalle, updateDetalleDevolucionDto);
    return await this.detalleDevolucionRepository.save(detalle);
  }

  async remove(id: number): Promise<void> {
    const detalle = await this.findOne(id);

    // Verificar que la devolución esté pendiente
    if (detalle.devolucionVenta.estado !== EstadoDevolucion.PENDIENTE) {
      throw new BadRequestException('Solo se pueden eliminar detalles de devoluciones pendientes');
    }

    await this.detalleDevolucionRepository.remove(detalle);
  }

  // Método para crear múltiples detalles de una vez
  async createMultiple(detalles: CreateDetalleDevolucionVentaDto[]): Promise<DetalleDevolucionVenta[]> {
    const detallesCreados: DetalleDevolucionVenta[] = [];

    // Verificar que todos los detalles pertenecen a la misma devolución
    const devolucionIds = [...new Set(detalles.map(d => d.id_devolucion_venta))];
    if (devolucionIds.length > 1) {
      throw new BadRequestException('Todos los detalles deben pertenecer a la misma devolución');
    }

    for (const detalleDto of detalles) {
      const detalle = await this.create(detalleDto);
      detallesCreados.push(detalle);
    }

    return detallesCreados;
  }

  // Método para obtener estadísticas de productos devueltos
  async getEstadisticasProductos() {
    const estadisticas = await this.detalleDevolucionRepository
      .createQueryBuilder('detalle')
      .leftJoin('detalle.producto', 'producto')
      .leftJoin('detalle.devolucionVenta', 'devolucion')
      .select([
        'producto.nombre as nombre_producto',
        'producto.codigo_barras as codigo_barras',
        'SUM(detalle.unidades_devueltas) as total_unidades_devueltas',
        'SUM(detalle.subtotal_devolucion) as total_monto_devuelto',
        'COUNT(detalle.id_detalle_devolucion) as total_devoluciones'
      ])
      .where('devolucion.estado = :estado', { estado: EstadoDevolucion.APROBADA })
      .groupBy('detalle.id_producto')
      .orderBy('total_unidades_devueltas', 'DESC')
      .getRawMany();

    return estadisticas;
  }

  // Método para obtener estadísticas por estado de producto
  async getEstadisticasPorEstadoProducto() {
    const estadisticas = await this.detalleDevolucionRepository
      .createQueryBuilder('detalle')
      .leftJoin('detalle.devolucionVenta', 'devolucion')
      .select([
        'detalle.estado_producto as estado',
        'COUNT(detalle.id_detalle_devolucion) as cantidad',
        'SUM(detalle.unidades_devueltas) as total_unidades',
        'SUM(detalle.subtotal_devolucion) as total_monto'
      ])
      .where('devolucion.estado = :estado', { estado: EstadoDevolucion.APROBADA })
      .groupBy('detalle.estado_producto')
      .getRawMany();

    return estadisticas;
  }
}