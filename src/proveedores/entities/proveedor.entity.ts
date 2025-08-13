import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Compra } from '../../compra/entities/compra.entity';
import { DevolucionCompra } from '../../devolucion-compra/entities/devolucion-compra.entity';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id_proveedor: number;

  @Column({ length: 100 })
  nombre_empresa: string;

  @Column({ length: 100, nullable: true })
  contacto: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ length: 100, nullable: true })
  pais: string;

  @Column({ length: 20, nullable: true })
  ruc_nit: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  @OneToMany(() => Compra, (compra) => compra.proveedor)
  compras: Compra[];

  @OneToMany(() => DevolucionCompra, (devolucionCompra) => devolucionCompra.proveedor)
  devolucionesCompra: DevolucionCompra[];
}
