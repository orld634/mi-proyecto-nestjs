import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('promociones')
export class Promocion {
  @PrimaryGeneratedColumn()
  id_promocion: number;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre_promocion: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  descuento: number;

  @Column({ type: 'date', nullable: false })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: false })
  fecha_fin: Date;

  @Column({ type: 'int', default: 0, nullable: false })
  cantidad_productos: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'int', nullable: false })
  id_producto: number;

  @ManyToOne(() => Producto, (producto) => producto.promociones, {
    eager: false,
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}