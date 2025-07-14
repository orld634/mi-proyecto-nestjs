import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Venta } from '../../venta/entities/venta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_venta')
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id_detalle_venta: number;

  @Column()
  id_venta: number;

  @Column()
  id_producto: number;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  // Relaciones
  @ManyToOne(() => Venta, venta => venta.detalles)
  @JoinColumn({ name: 'id_venta' })
  venta: Venta;

  @ManyToOne(() => Producto, producto => producto.detalleVentas)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;
}
