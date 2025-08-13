import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DetalleVenta } from '../../detalle-venta/entities/detalle-venta.entity';
import { DetalleCompra } from '../../detalle-compra/entities/detalle-compra.entity';
import { DetalleCarrito } from '../../detalle-carrito/entities/detalle-carrito.entity';
import { InventarioMovimiento } from '../../inventario-movimiento/entities/inventario-movimiento.entity';
import { DetalleDevolucionVenta } from '../../detalle-devolucion-venta/entities/detalle-devolucion-venta.entity';
import { DetalleDevolucionCompra } from '../../detalle-devolucion-compra/entities/detalle-devolucion-compra.entity';
import { Categoria } from '../../categoria/entities/categoria.entity';

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

  // 🆕 RELACIÓN CON CATEGORIA
  @ManyToOne(() => Categoria, (categoria) => categoria.productos, {
    eager: false,
    onDelete: 'RESTRICT', // No permite eliminar categoría si tiene productos
  })
  @JoinColumn({ name: 'id_categoria' })
  categoria: Categoria;

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

  // Relación con DetalleCarrito (Un producto puede aparecer en múltiples detalles de carrito)
  @OneToMany(() => DetalleCarrito, detalleCarrito => detalleCarrito.producto, {
    cascade: false,
    eager: false
  })
  detallesCarrito: DetalleCarrito[];

  // Relación con InventarioMovimiento (Un producto puede tener muchos movimientos de inventario)
  @OneToMany(() => InventarioMovimiento, movimiento => movimiento.producto, {
    cascade: false,
    eager: false,
  })
  movimientos: InventarioMovimiento[];

  // Relación con DetalleDevolucionVenta (Un producto puede aparecer en múltiples detalles de devolución de venta)
  @OneToMany(() => DetalleDevolucionVenta, (detalleDevolucion) => detalleDevolucion.producto, {
    cascade: false,
    eager: false
  })
  detallesDevolucionVenta: DetalleDevolucionVenta[];

  // Relación con DetalleDevolucionCompra (Un producto puede aparecer en múltiples detalles de devolución de compra)
  @OneToMany(() => DetalleDevolucionCompra, (detalleDevolucionCompra) => detalleDevolucionCompra.producto, {
    cascade: false,
    eager: false
  })
  detallesDevolucionCompra: DetalleDevolucionCompra[];
}