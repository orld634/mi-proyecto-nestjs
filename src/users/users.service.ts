import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: {
    email: string;  
    nombre: string;
    apellido: string;
    password: string;
    role?: string;
  }): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    
    
    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con este email');
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

   
    // Crear el usuario
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || 'user',
    });

   
    return await this.userRepository.save(user);


  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async validatePassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'nombre', 'apellido', 'role', 'activo', 'fechaCreacion'],
      order: { fechaCreacion: 'DESC' },
    });
  }
}