import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { Compra } from '../../compra/entities/compra.entity';
import { DetalleDevolucionCompra } from '../../detalle-devolucion-compra/entities/detalle-devolucion-compra.entity';

export enum EstadoDevolucionCompra {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada'
}

@Entity('devolucion_compras')
export class DevolucionCompra {
  @PrimaryGeneratedColumn()
  id_devolucion_compra: number;

  @Column()
  id_compra: number;

  @Column({ length: 50 })
  rol_encargado: string;

  @Column()
  id_proveedor: number;

  @Column()
  id_usuario: number;

  @Column({ type: 'date' })
  fecha_devolucion: Date;

  @Column({ type: 'text' })
  motivo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_devuelto: number;

  @Column({
    type: 'enum',
    enum: EstadoDevolucionCompra,
    default: EstadoDevolucionCompra.PENDIENTE
  })
  estado: EstadoDevolucionCompra;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Compra (Una devolución pertenece a una compra)
  @ManyToOne(() => Compra, { eager: true })
  @JoinColumn({ name: 'id_compra' })
  compra: Compra;

  // Relación con Usuario Admin (Solo usuarios admin pueden gestionar devoluciones)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  // Relación con Proveedor (La devolución se hace al proveedor)
  @ManyToOne(() => Proveedor, { eager: true })
  @JoinColumn({ name: 'id_proveedor' })
  proveedor: Proveedor;

  // NUEVA RELACIÓN: Una devolución puede tener múltiples detalles
  @OneToMany(() => DetalleDevolucionCompra, detalleDevolucion => detalleDevolucion.devolucionCompra, {
    cascade: true
  })
  detalles: DetalleDevolucionCompra[];
}