// src/users/users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcryptjs from 'bcryptjs';

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
    const hashedPassword = await bcryptjs.hash(userData.password, saltRounds);

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
    return await bcryptjs.compare(plainPassword, hashedPassword);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'nombre', 'apellido', 'role', 'activo', 'fechaCreacion'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  // NUEVOS MÉTODOS PARA RESET PASSWORD
  
  /**
   * Actualiza el token de reset y su fecha de expiración para un usuario
   * @param userId ID del usuario
   * @param hashedCode Token hasheado
   * @param expiry Fecha de expiración del token
   */
  async updateResetToken(userId: number, hashedCode: string, expiry: Date): Promise<void> {
    const result = await this.userRepository.update(userId, {
      resetToken: hashedCode,
      resetTokenExpiry: expiry,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
  }

  /**
   * Actualiza la contraseña del usuario y limpia los tokens de reset
   * @param userId ID del usuario
   * @param hashedPassword Nueva contraseña hasheada
   */
  async updatePasswordAndClearToken(userId: number, hashedPassword: string): Promise<void> {
    const result = await this.userRepository.update(userId, {
      password: hashedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
  }

  /**
   * Limpia los tokens de reset de un usuario (útil para limpiar tokens expirados)
   * @param userId ID del usuario
   */
  async clearResetToken(userId: number): Promise<void> {
    await this.userRepository.update(userId, {
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });
  }

  /**
   * Busca usuarios con tokens de reset expirados y los limpia
   */
  async cleanupExpiredTokens(): Promise<void> {
    await this.userRepository.update(
      {
        resetTokenExpiry: LessThan(new Date()), // Tokens expirados
      },
      {
        resetToken: undefined,
        resetTokenExpiry: undefined,
      }
    );
  }

  /**
   * Actualiza los datos de un usuario
   * @param id ID del usuario
   * @param updateData Datos a actualizar
   */
  async update(id: number, updateData: Partial<User>): Promise<void> {
    await this.findById(id);
    const result = await this.userRepository.update(id, updateData);

    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }
}