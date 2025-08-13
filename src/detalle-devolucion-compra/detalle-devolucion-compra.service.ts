import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleDevolucionCompra, EstadoDetalle, CondicionProducto } from './entities/detalle-devolucion-compra.entity';
import { CreateDetalleDevolucionCompraDto } from './dto/create-detalle-devolucion-compra.dto';
import { UpdateDetalleDevolucionCompraDto } from './dto/update-detalle-devolucion-compra.dto';
import { DevolucionCompra } from '../devolucion-compra/entities/devolucion-compra.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class DetalleDevolucionCompraService {
  constructor(
    @InjectRepository(DetalleDevolucionCompra)
    private readonly detalleDevolucionRepository: Repository<DetalleDevolucionCompra>,
    @InjectRepository(DevolucionCompra)
    private readonly devolucionCompraRepository: Repository<DevolucionCompra>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createDetalleDevolucionCompraDto: CreateDetalleDevolucionCompraDto): Promise<DetalleDevolucionCompra> {
    // Verificar que existe la devolución de compra
    const devolucionCompra = await this.devolucionCompraRepository.findOne({
      where: { id_devolucion_compra: createDetalleDevolucionCompraDto.id_devolucion_compra }
    });

    if (!devolucionCompra) {
      throw new NotFoundException('Devolución de compra no encontrada');
    }

    // Verificar que existe el producto
    const producto = await this.productoRepository.findOne({
      where: { id_producto: createDetalleDevolucionCompraDto.id_producto }
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Verificar que el subtotal coincida con cantidad * precio_unitario
    const subtotalCalculado = createDetalleDevolucionCompraDto.cantidad_devuelta * createDetalleDevolucionCompraDto.precio_unitario;
    if (Math.abs(subtotalCalculado - createDetalleDevolucionCompraDto.subtotal_devolucion) > 0.01) {
      throw new BadRequestException('El subtotal no coincide con la cantidad multiplicada por el precio unitario');
    }

    const detalleDevolucion = this.detalleDevolucionRepository.create(createDetalleDevolucionCompraDto);
    return await this.detalleDevolucionRepository.save(detalleDevolucion);
  }

  async findAll(): Promise<DetalleDevolucionCompra[]> {
    return await this.detalleDevolucionRepository.find({
      relations: ['devolucionCompra', 'producto']
    });
  }

  async findOne(id: number): Promise<DetalleDevolucionCompra> {
    const detalleDevolucion = await this.detalleDevolucionRepository.findOne({
      where: { id_detalle_devolucion: id },
      relations: ['devolucionCompra', 'producto']
    });

    if (!detalleDevolucion) {
      throw new NotFoundException(`Detalle de devolución con ID ${id} no encontrado`);
    }

    return detalleDevolucion;
  }

  async findByDevolucionCompra(idDevolucionCompra: number): Promise<DetalleDevolucionCompra[]> {
    return await this.detalleDevolucionRepository.find({
      where: { id_devolucion_compra: idDevolucionCompra },
      relations: ['producto']
    });
  }

  async findByProducto(idProducto: number): Promise<DetalleDevolucionCompra[]> {
    return await this.detalleDevolucionRepository.find({
      where: { id_producto: idProducto },
      relations: ['devolucionCompra']
    });
  }

  async findByEstado(estado: EstadoDetalle): Promise<DetalleDevolucionCompra[]> {
    return await this.detalleDevolucionRepository.find({
      where: { estado },
      relations: ['devolucionCompra', 'producto']
    });
  }

  async findByCondicion(condicion: CondicionProducto): Promise<DetalleDevolucionCompra[]> {
    return await this.detalleDevolucionRepository.find({
      where: { condicion_producto: condicion },
      relations: ['devolucionCompra', 'producto']
    });
  }

  async update(id: number, updateDetalleDevolucionCompraDto: UpdateDetalleDevolucionCompraDto): Promise<DetalleDevolucionCompra> {
    const detalleDevolucion = await this.findOne(id);

    // Si se actualizan cantidad o precio, recalcular subtotal
    if (updateDetalleDevolucionCompraDto.cantidad_devuelta || updateDetalleDevolucionCompraDto.precio_unitario) {
      const cantidad = updateDetalleDevolucionCompraDto.cantidad_devuelta || detalleDevolucion.cantidad_devuelta;
      const precio = updateDetalleDevolucionCompraDto.precio_unitario || detalleDevolucion.precio_unitario;
      updateDetalleDevolucionCompraDto.subtotal_devolucion = cantidad * precio;
    }

    // Si se proporciona un subtotal específico, verificar que sea correcto
    if (updateDetalleDevolucionCompraDto.subtotal_devolucion) {
      const cantidad = updateDetalleDevolucionCompraDto.cantidad_devuelta || detalleDevolucion.cantidad_devuelta;
      const precio = updateDetalleDevolucionCompraDto.precio_unitario || detalleDevolucion.precio_unitario;
      const subtotalCalculado = cantidad * precio;
      
      if (Math.abs(subtotalCalculado - updateDetalleDevolucionCompraDto.subtotal_devolucion) > 0.01) {
        throw new BadRequestException('El subtotal no coincide con la cantidad multiplicada por el precio unitario');
      }
    }

    Object.assign(detalleDevolucion, updateDetalleDevolucionCompraDto);
    return await this.detalleDevolucionRepository.save(detalleDevolucion);
  }

  async aprobar(id: number, observaciones?: string): Promise<DetalleDevolucionCompra> {
    const detalleDevolucion = await this.findOne(id);
    
    detalleDevolucion.estado = EstadoDetalle.APROBADA;
    if (observaciones) {
      detalleDevolucion.observaciones = observaciones;
    }

    return await this.detalleDevolucionRepository.save(detalleDevolucion);
  }

  async rechazar(id: number, observaciones: string): Promise<DetalleDevolucionCompra> {
    const detalleDevolucion = await this.findOne(id);
    
    detalleDevolucion.estado = EstadoDetalle.RECHAZADA;
    detalleDevolucion.observaciones = observaciones;

    return await this.detalleDevolucionRepository.save(detalleDevolucion);
  }

  async remove(id: number): Promise<void> {
    const detalleDevolucion = await this.findOne(id);
    await this.detalleDevolucionRepository.remove(detalleDevolucion);
  }

  // Métodos para estadísticas
  async getTotalDetallesPorDevolucion(idDevolucionCompra: number): Promise<number> {
    return await this.detalleDevolucionRepository.count({
      where: { id_devolucion_compra: idDevolucionCompra }
    });
  }

  async getMontoTotalPorDevolucion(idDevolucionCompra: number): Promise<number> {
    const result = await this.detalleDevolucionRepository
      .createQueryBuilder('detalle')
      .select('SUM(detalle.subtotal_devolucion)', 'total')
      .where('detalle.id_devolucion_compra = :idDevolucionCompra', { idDevolucionCompra })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async getEstadisticasPorEstado(): Promise<any> {
    return await this.detalleDevolucionRepository
      .createQueryBuilder('detalle')
      .select('detalle.estado', 'estado')
      .addSelect('COUNT(*)', 'cantidad')
      .addSelect('SUM(detalle.subtotal_devolucion)', 'monto_total')
      .groupBy('detalle.estado')
      .getRawMany();
  }

  async getEstadisticasPorCondicion(): Promise<any> {
    return await this.detalleDevolucionRepository
      .createQueryBuilder('detalle')
      .select('detalle.condicion_producto', 'condicion')
      .addSelect('COUNT(*)', 'cantidad')
      .addSelect('SUM(detalle.subtotal_devolucion)', 'monto_total')
      .groupBy('detalle.condicion_producto')
      .getRawMany();
  }
}