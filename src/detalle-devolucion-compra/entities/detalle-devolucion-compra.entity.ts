import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { DevolucionCompra } from '../../devolucion-compra/entities/devolucion-compra.entity';
import { Producto } from '../../productos/entities/producto.entity';

export enum CondicionProducto {
  NUEVO = 'nuevo',
  USADO = 'usado',
  DEFECTUOSO = 'defectuoso'
}

export enum EstadoDetalle {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada'
}

@Entity('detalle_devolucion_compras')
export class DetalleDevolucionCompra {
  @PrimaryGeneratedColumn()
  id_detalle_devolucion: number;

  @Column()
  id_devolucion_compra: number;

  @Column()
  id_producto: number;

  @Column({ type: 'int' })
  cantidad_devuelta: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal_devolucion: number;

  @Column({
    type: 'enum',
    enum: CondicionProducto,
    default: CondicionProducto.NUEVO
  })
  condicion_producto: CondicionProducto;

  @Column({
    type: 'enum',
    enum: EstadoDetalle,
    default: EstadoDetalle.PENDIENTE
  })
  estado: EstadoDetalle;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con DevolucionCompra (Un detalle pertenece a una devolución)
  @ManyToOne(() => DevolucionCompra, devolucionCompra => devolucionCompra.detalles, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'id_devolucion_compra' })
  devolucionCompra: DevolucionCompra;

  // Relación con Producto (Un detalle hace referencia a un producto)
  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;
}