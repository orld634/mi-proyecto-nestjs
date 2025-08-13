import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('categoria')
export class Categoria {
  @PrimaryGeneratedColumn()
  id_categoria: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relación con Producto (Una categoría puede tener muchos productos)
  @OneToMany(() => Producto, (producto) => producto.categoria, {
    cascade: false,
    eager: false
  })
  productos: Producto[];
}
