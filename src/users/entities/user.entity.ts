import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

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
}