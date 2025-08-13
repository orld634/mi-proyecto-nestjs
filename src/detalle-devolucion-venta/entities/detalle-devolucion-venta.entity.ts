import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DevolucionVenta } from '../../devolucion-venta/entities/devolucion-venta.entity';
import { Producto } from '../../productos/entities/producto.entity';

export enum EstadoProductoDevolucion {
  USADO = 'usado',
  DEFECTUOSO = 'defectuoso',
  NUEVO = 'nuevo'
}

@Entity('detalle_devolucion_venta')
export class DetalleDevolucionVenta {
  @PrimaryGeneratedColumn()
  id_detalle_devolucion: number;

  @Column()
  id_devolucion_venta: number;

  @Column()
  id_producto: number;

  @Column({ type: 'int' })
  unidades_devueltas: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal_devolucion: number;

  @Column({
    type: 'enum',
    enum: EstadoProductoDevolucion,
    default: EstadoProductoDevolucion.USADO
  })
  estado_producto: EstadoProductoDevolucion;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con DevolucionVenta
  @ManyToOne(() => DevolucionVenta, (devolucion) => devolucion.detallesDevolucion)
  @JoinColumn({ name: 'id_devolucion_venta' })
  devolucionVenta: DevolucionVenta;

  // Relación con Producto
  @ManyToOne(() => Producto, (producto) => producto.detallesDevolucionVenta)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;
}