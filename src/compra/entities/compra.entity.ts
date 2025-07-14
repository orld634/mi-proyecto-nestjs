import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { DetalleCompra } from '../../detalle-compra/entities/detalle-compra.entity';

export enum EstadoCompra {
  RECIBIDA = 'recibida',
  PENDIENTE = 'pendiente',
  CANCELADA = 'cancelada'
}

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn()
  id_compra: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  numero_orden: string;

  @Column()
  id_proveedor: number;

  @Column()
  id_usuario: number;

  @Column({ type: 'date' })
  fecha_compra: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_compra: number;

  @Column({
    type: 'enum',
    enum: EstadoCompra,
    default: EstadoCompra.PENDIENTE
  })
  estado: EstadoCompra;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con proveedor
  @ManyToOne(() => Proveedor, { eager: true })
  @JoinColumn({ name: 'id_proveedor' })
  proveedor: Proveedor;

  // Relación con usuario (solo admins pueden hacer compras)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  // Relación con DetalleCompra (Una compra puede tener múltiples detalles)
  @OneToMany(() => DetalleCompra, (detalleCompra) => detalleCompra.compra, {
    cascade: ['insert', 'update'],
    eager: false
  })
  detalles: DetalleCompra[];
}