import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Producto } from '../../productos/entities/producto.entity';

export enum TipoMovimiento {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
  AJUSTE_POSITIVO = 'AJUSTE_POSITIVO',
  AJUSTE_NEGATIVO = 'AJUSTE_NEGATIVO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  DEVOLUCION = 'DEVOLUCION'
}

@Entity('inventario_movimientos')
export class InventarioMovimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_producto' })
  idProducto: number;

  @Column({
    type: 'enum',
    enum: TipoMovimiento,
    name: 'tipo_movimiento'
  })
  tipoMovimiento: TipoMovimiento;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    name: 'precio_unitario'
  })
  precioUnitario: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referencia: string;

  @Column({ 
    type: 'timestamp',
    name: 'fecha_movimiento',
    default: () => 'CURRENT_TIMESTAMP'
  })
  fechaMovimiento: Date;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    name: 'stock_minimo',
    nullable: true
  })
  stockMinimo: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2,
    name: 'stock_maximo',
    nullable: true
  })
  stockMaximo: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Producto, producto => producto.movimientos, { eager: true })
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

 @ManyToOne(() => User, user => user.movimientosInventario, {
    eager: true
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;
}
