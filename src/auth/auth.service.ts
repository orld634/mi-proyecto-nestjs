import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create(registerDto);
      console.log(user)
      
      // Generar token para el usuario recién registrado
      
      return {
        mensaje: 'Usuario registrado exitosamente',
        usuario: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          role: user.role,
        },
      
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Error al registrar usuario');
    }
  }

  async login(loginDto: LoginDto) {

  
    // Buscar usuario por email
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Validar contraseña
    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      mensaje: 'Login exitoso',
      usuario: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        role: user.role,
      },
      access_token: token,
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await this.usersService.validatePassword(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      role: user.role,
      activo: user.activo,
      fechaCreacion: user.fechaCreacion,
    };
  }
}