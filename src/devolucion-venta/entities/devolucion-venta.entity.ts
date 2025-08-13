import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Venta } from '../../venta/entities/venta.entity';
import { DetalleDevolucionVenta } from '../../detalle-devolucion-venta/entities/detalle-devolucion-venta.entity';

export enum EstadoDevolucion {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada'
}

@Entity('devoluciones_venta')
export class DevolucionVenta {
  @PrimaryGeneratedColumn()
  id_devolucion: number;

  @Column()
  id_venta: number;

  @Column()
  id_usuario: number;

  @Column({ type: 'date' })
  fecha_devolucion: Date;

  @Column({ type: 'varchar', length: 500 })
  motivo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_devuelto: number;

  @Column({
    type: 'enum',
    enum: EstadoDevolucion,
    default: EstadoDevolucion.PENDIENTE
  })
  estado: EstadoDevolucion;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Usuario
  @ManyToOne(() => User, (user) => user.devolucionesVenta)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  // Relación con Venta
  @ManyToOne(() => Venta, (venta) => venta.devoluciones)
  @JoinColumn({ name: 'id_venta' })
  venta: Venta;

  // Relación con DetalleDevolucionVenta (Una devolución puede tener múltiples detalles)
  @OneToMany(() => DetalleDevolucionVenta, (detalle) => detalle.devolucionVenta, {
    cascade: true,
    eager: false
  })
  detallesDevolucion: DetalleDevolucionVenta[];
}