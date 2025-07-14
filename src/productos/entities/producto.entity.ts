import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DetalleVenta } from '../../detalle-venta/entities/detalle-venta.entity';
import { DetalleCompra } from '../../detalle-compra/entities/detalle-compra.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id_producto: number;

  @Column({ unique: true, length: 50 })
  codigo_barras: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 50 })
  marca: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_compra: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_venta: number;

  @Column({ type: 'int' })
  stock_minimo: number;

  @Column({ type: 'int' })
  stock_actual: number;

  @Column({ length: 255, nullable: true })
  imagen_url: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column()
  id_categoria: number;

  // Relación con DetalleVenta (Un producto puede aparecer en múltiples detalles de venta)
  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.producto, {
    cascade: false,
    eager: false
  })
  detalleVentas: DetalleVenta[];

  // Relación con DetalleCompra (Un producto puede aparecer en múltiples detalles de compra)
  @OneToMany(() => DetalleCompra, (detalleCompra) => detalleCompra.producto, {
    cascade: false,
    eager: false
  })
  detalleCompras: DetalleCompra[];

  // Si tienes una entidad Categoria, puedes agregar la relación:
  // @ManyToOne(() => Categoria)
  // @JoinColumn({ name: 'id_categoria' })
  // categoria: Categoria;
}