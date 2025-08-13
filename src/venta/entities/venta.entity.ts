import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DetalleVenta } from '../../detalle-venta/entities/detalle-venta.entity';
import { DevolucionVenta } from '../../devolucion-venta/entities/devolucion-venta.entity';

export enum EstadoVenta {
  COMPLETADA = 'completada',
  PENDIENTE = 'pendiente'
}

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id_venta: number;

  @Column()
  id_usuario: number;

  @Column({ type: 'date' })
  fecha_venta: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  impuesto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  descuento: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_venta: number;

  @Column({
    type: 'enum',
    enum: EstadoVenta,
    default: EstadoVenta.PENDIENTE
  })
  estado: EstadoVenta;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Usuario
  @ManyToOne(() => User, (user) => user.ventas)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  // Relación con DetalleVenta (Una venta puede tener múltiples detalles)
  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.venta, {
    cascade: true,
    eager: false
  })
  detalles: DetalleVenta[];

  // Relación con DevolucionVenta (Una venta puede tener múltiples devoluciones)
  @OneToMany(() => DevolucionVenta, (devolucion) => devolucion.venta)
  devoluciones: DevolucionVenta[];
}