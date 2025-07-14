import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Venta } from '../../venta/entities/venta.entity';
import { Compra } from '../../compra/entities/compra.entity';

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
}