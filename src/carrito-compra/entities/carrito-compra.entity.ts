import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DetalleCarrito } from '../../detalle-carrito/entities/detalle-carrito.entity';

@Entity('carrito_compra')
export class CarritoCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_usuario' })
  idUsuario: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @Column({ 
    type: 'enum', 
    enum: ['activo', 'inactivo'], 
    default: 'activo' 
  })
  estado: string;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    default: 0.00 
  })
  subtotal: number;

  // Relación con Usuario
  @ManyToOne(() => User, (user) => user.carritos)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  // Relación con DetalleCarrito
  @OneToMany(() => DetalleCarrito, detalleCarrito => detalleCarrito.carritoCompra)
  detalles: DetalleCarrito[];
}