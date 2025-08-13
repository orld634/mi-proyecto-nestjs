import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Venta } from '../../venta/entities/venta.entity';
import { Compra } from '../../compra/entities/compra.entity';
import { CarritoCompra } from '../../carrito-compra/entities/carrito-compra.entity';
import { InventarioMovimiento } from '../../inventario-movimiento/entities/inventario-movimiento.entity';
import { DevolucionVenta } from '../../devolucion-venta/entities/devolucion-venta.entity';
import { DevolucionCompra } from '../../devolucion-compra/entities/devolucion-compra.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column()
  @Exclude() // Excluir password de las respuestas JSON
  password: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // Relación con Ventas (Un usuario puede tener muchas ventas)
  @OneToMany(() => Venta, (venta) => venta.usuario)
  ventas: Venta[];

  // Relación con Compras (Un admin puede tener muchas compras)
  @OneToMany(() => Compra, (compra) => compra.usuario)
  compras: Compra[];

  // Relación con Carritos de Compra (Un usuario puede tener muchos carritos)
  @OneToMany(() => CarritoCompra, (carrito) => carrito.usuario)
  carritos: CarritoCompra[];

  // Relación con Movimientos de Inventario (Solo administradores pueden gestionar inventario)
  @OneToMany(() => InventarioMovimiento, movimiento => movimiento.usuario)
  movimientosInventario: InventarioMovimiento[];

  // Relación con Devoluciones de Venta (Un usuario puede tener muchas devoluciones)
  @OneToMany(() => DevolucionVenta, (devolucion) => devolucion.usuario)
  devolucionesVenta: DevolucionVenta[];

  // Relación con Devoluciones de Compra (Solo usuarios admin pueden gestionar devoluciones de compra)
  @OneToMany(() => DevolucionCompra, (devolucionCompra) => devolucionCompra.usuario)
  devolucionesCompra: DevolucionCompra[];

  // Método para verificar si el usuario puede gestionar inventario
  canManageInventory(): boolean {
    return this.role === 'admin';
  }

  // Método para verificar si el usuario puede gestionar devoluciones de compra
  canManagePurchaseReturns(): boolean {
    return this.role === 'admin';
  }

  // Getter para compatibilidad con el código existente
  get rol(): string {
    return this.role;
  }
}