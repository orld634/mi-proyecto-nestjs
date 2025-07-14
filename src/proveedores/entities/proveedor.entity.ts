import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Compra } from '../../compra/entities/compra.entity';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id_proveedor: number;

  @Column({ length: 100 })
  nombre_empresa: string;

  @Column({ length: 100 })
  contacto: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ type: 'text' })
  direccion: string;

  @Column({ length: 50 })
  pais: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ length: 20, unique: true })
  ruc_nit: string;

  // Relación con Compras (Un proveedor puede tener muchas compras)
  @OneToMany(() => Compra, (compra) => compra.proveedor)
  compras: Compra[];
}