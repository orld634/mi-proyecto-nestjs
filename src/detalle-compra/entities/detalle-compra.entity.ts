import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Compra } from '../../compra/entities/compra.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_compras')
export class DetalleCompra {
  @PrimaryGeneratedColumn()
  id_detalle_compra: number;

  @Column()
  id_compra: number;

  @Column()
  id_producto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Compra
  @ManyToOne(() => Compra, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_compra' })
  compra: Compra;

  // Relación con Producto
  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

  // Calcular subtotal automáticamente antes de insertar o actualizar
  @BeforeInsert()
  @BeforeUpdate()
  calcularSubtotal() {
    this.subtotal = Number((this.cantidad * this.precio_unitario).toFixed(2));
  }
}