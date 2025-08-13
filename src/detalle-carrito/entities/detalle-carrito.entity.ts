import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CarritoCompra } from '../../carrito-compra/entities/carrito-compra.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_carrito')
export class DetalleCarrito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_carrito_compra' })
  idCarritoCompra: number;

  @Column({ name: 'id_producto' })
  idProducto: number;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

  @Column({ 
    name: 'precio_unitario',
    type: 'decimal', 
    precision: 10, 
    scale: 2 
  })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @CreateDateColumn({ name: 'fecha_agregado' })
  fechaAgregado: Date;

  // Relaciones
  @ManyToOne(() => CarritoCompra, carritoCompra => carritoCompra.detalles)
  @JoinColumn({ name: 'id_carrito_compra' })
  carritoCompra: CarritoCompra;

  @ManyToOne(() => Producto, producto => producto.detallesCarrito)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;
}