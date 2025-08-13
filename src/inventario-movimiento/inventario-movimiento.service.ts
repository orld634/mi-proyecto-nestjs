import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventarioMovimiento, TipoMovimiento } from '../inventario-movimiento/entities/inventario-movimiento.entity';
import { CreateInventarioMovimientoDto } from './dto/create-inventario-movimiento.dto';
import { UpdateInventarioMovimientoDto } from './dto/update-inventario-movimiento.dto';
import { User } from '../users/entities/user.entity';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class InventarioMovimientoService {
  constructor(
    @InjectRepository(InventarioMovimiento)
    private readonly inventarioMovimientoRepository: Repository<InventarioMovimiento>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createInventarioMovimientoDto: CreateInventarioMovimientoDto, usuarioId: number): Promise<InventarioMovimiento> {
    // Verificar que el usuario existe y es administrador
    const usuario = await this.userRepository.findOne({ 
      where: { 
        id: usuarioId,
        rol: 'administrador' // Validación estricta del rol
      } 
    });
    
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado o no tiene permisos de administrador');
    }

    // Verificar que el producto existe
    const producto = await this.productoRepository.findOne({ where: { id_producto: createInventarioMovimientoDto.idProducto } });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Validar stock mínimo y máximo
    if (createInventarioMovimientoDto.stockMinimo && createInventarioMovimientoDto.stockMaximo) {
      if (createInventarioMovimientoDto.stockMinimo > createInventarioMovimientoDto.stockMaximo) {
        throw new BadRequestException('El stock mínimo no puede ser mayor al stock máximo');
      }
    }

    const inventarioMovimiento = this.inventarioMovimientoRepository.create({
      ...createInventarioMovimientoDto,
      usuarioId,
      fechaMovimiento: createInventarioMovimientoDto.fechaMovimiento || new Date(),
    });

    const savedMovimiento = await this.inventarioMovimientoRepository.save(inventarioMovimiento);

    // Actualizar el stock del producto según el tipo de movimiento
    await this.actualizarStockProducto(
      createInventarioMovimientoDto.idProducto,
      createInventarioMovimientoDto.cantidad,
      createInventarioMovimientoDto.tipoMovimiento
    );

    return this.findOne(savedMovimiento.id);
  }

  async findAll(): Promise<InventarioMovimiento[]> {
    return await this.inventarioMovimientoRepository.find({
      relations: ['producto', 'usuario'],
      order: { fechaMovimiento: 'DESC' }
    });
  }

  async findOne(id: number): Promise<InventarioMovimiento> {
    const inventarioMovimiento = await this.inventarioMovimientoRepository.findOne({
      where: { id },
      relations: ['producto', 'usuario']
    });

    if (!inventarioMovimiento) {
      throw new NotFoundException(`Movimiento de inventario con ID ${id} no encontrado`);
    }

    return inventarioMovimiento;
  }

  async findByProducto(idProducto: number): Promise<InventarioMovimiento[]> {
    return await this.inventarioMovimientoRepository.find({
      where: { idProducto },
      relations: ['producto', 'usuario'],
      order: { fechaMovimiento: 'DESC' }
    });
  }

  async findByTipoMovimiento(tipoMovimiento: TipoMovimiento): Promise<InventarioMovimiento[]> {
    return await this.inventarioMovimientoRepository.find({
      where: { tipoMovimiento },
      relations: ['producto', 'usuario'],
      order: { fechaMovimiento: 'DESC' }
    });
  }

  async findByFechas(fechaInicio: Date, fechaFin: Date): Promise<InventarioMovimiento[]> {
    return await this.inventarioMovimientoRepository
      .createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.producto', 'producto')
      .leftJoinAndSelect('movimiento.usuario', 'usuario')
      .where('movimiento.fechaMovimiento BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      })
      .orderBy('movimiento.fechaMovimiento', 'DESC')
      .getMany();
  }

  async update(id: number, updateInventarioMovimientoDto: UpdateInventarioMovimientoDto, usuarioId: number): Promise<InventarioMovimiento> {
    // Verificar que el usuario es administrador
    const usuario = await this.userRepository.findOne({ 
      where: { 
        id: usuarioId,
        rol: 'administrador'
      } 
    });
    
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado o no tiene permisos de administrador');
    }

    const inventarioMovimiento = await this.findOne(id);

    // Si se está cambiando el producto, verificar que existe
    if (updateInventarioMovimientoDto.idProducto && updateInventarioMovimientoDto.idProducto !== inventarioMovimiento.idProducto) {
      const producto = await this.productoRepository.findOne({ where: { id_producto: updateInventarioMovimientoDto.idProducto } });
      if (!producto) {
        throw new NotFoundException('Producto no encontrado');
      }
    }

    // Validar stock mínimo y máximo
    if (updateInventarioMovimientoDto.stockMinimo && updateInventarioMovimientoDto.stockMaximo) {
      if (updateInventarioMovimientoDto.stockMinimo > updateInventarioMovimientoDto.stockMaximo) {
        throw new BadRequestException('El stock mínimo no puede ser mayor al stock máximo');
      }
    }

    // Revertir el movimiento anterior si se cambia cantidad o tipo
    if (updateInventarioMovimientoDto.cantidad || updateInventarioMovimientoDto.tipoMovimiento) {
      await this.revertirMovimientoStock(inventarioMovimiento);
    }

    await this.inventarioMovimientoRepository.update(id, updateInventarioMovimientoDto);

    // Aplicar el nuevo movimiento si se cambió cantidad o tipo
    if (updateInventarioMovimientoDto.cantidad || updateInventarioMovimientoDto.tipoMovimiento) {
      const movimientoActualizado = await this.findOne(id);
      await this.actualizarStockProducto(
        movimientoActualizado.idProducto,
        movimientoActualizado.cantidad,
        movimientoActualizado.tipoMovimiento
      );
    }

    return this.findOne(id);
  }

  async remove(id: number, usuarioId: number): Promise<void> {
    // Verificar que el usuario es administrador
    const usuario = await this.userRepository.findOne({ 
      where: { 
        id: usuarioId,
        rol: 'administrador'
      } 
    });
    
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado o no tiene permisos de administrador');
    }

    const inventarioMovimiento = await this.findOne(id);

    // Revertir el movimiento antes de eliminar
    await this.revertirMovimientoStock(inventarioMovimiento);

    await this.inventarioMovimientoRepository.remove(inventarioMovimiento);
  }

  private async actualizarStockProducto(idProducto: number, cantidad: number, tipoMovimiento: TipoMovimiento): Promise<void> {
    const producto = await this.productoRepository.findOne({ where: { id_producto: idProducto } });
    
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    let nuevoStock = producto.stock_actual || 0;

    switch (tipoMovimiento) {
      case TipoMovimiento.ENTRADA:
      case TipoMovimiento.AJUSTE_POSITIVO:
      case TipoMovimiento.DEVOLUCION:
        nuevoStock += cantidad;
        break;
      case TipoMovimiento.SALIDA:
      case TipoMovimiento.AJUSTE_NEGATIVO:
      case TipoMovimiento.TRANSFERENCIA:
        nuevoStock -= cantidad;
        break;
    }

    // Validar que el stock no sea negativo
    if (nuevoStock < 0) {
      throw new BadRequestException('El movimiento resultaría en stock negativo');
    }

    await this.productoRepository.update(idProducto, { stock_actual: nuevoStock });
  }

  private async revertirMovimientoStock(movimiento: InventarioMovimiento): Promise<void> {
    const producto = await this.productoRepository.findOne({ where: { id_producto: movimiento.idProducto } });
    
    if (!producto) {
      return; // Si el producto no existe, no se puede revertir
    }

    let nuevoStock = producto.stock_actual || 0;

    // Revertir el movimiento (hacer lo contrario)
    switch (movimiento.tipoMovimiento) {
      case TipoMovimiento.ENTRADA:
      case TipoMovimiento.AJUSTE_POSITIVO:
      case TipoMovimiento.DEVOLUCION:
        nuevoStock -= movimiento.cantidad;
        break;
      case TipoMovimiento.SALIDA:
      case TipoMovimiento.AJUSTE_NEGATIVO:
      case TipoMovimiento.TRANSFERENCIA:
        nuevoStock += movimiento.cantidad;
        break;
    }

    // Asegurar que el stock no sea negativo
    if (nuevoStock < 0) {
      nuevoStock = 0;
    }

    await this.productoRepository.update(movimiento.idProducto, { stock_actual: nuevoStock });
  }

  async getResumenInventario(): Promise<any> {
    const queryBuilder = this.inventarioMovimientoRepository
      .createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.producto', 'producto')
      .select([
        'producto.id as productoId',
        'producto.nombre as nombreProducto',
        'producto.stock as stockActual',
        'SUM(CASE WHEN movimiento.tipoMovimiento IN ("ENTRADA", "AJUSTE_POSITIVO", "DEVOLUCION") THEN movimiento.cantidad ELSE 0 END) as totalEntradas',
        'SUM(CASE WHEN movimiento.tipoMovimiento IN ("SALIDA", "AJUSTE_NEGATIVO", "TRANSFERENCIA") THEN movimiento.cantidad ELSE 0 END) as totalSalidas',
        'COUNT(movimiento.id) as totalMovimientos'
      ])
      .groupBy('producto.id')
      .getRawMany();

    return queryBuilder;
  }
}