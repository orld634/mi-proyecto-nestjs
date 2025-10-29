// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException, HttpException, HttpStatus, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    try {
      const adminEmail = 'admin@brazzinos.com';
      const adminPassword = await bcrypt.hash('Admin123!', 10);
      const adminName = 'Admin';
      const adminLastName = 'Principal';

      const existingAdmin = await this.usersService.findByEmail(adminEmail).catch(err => {
        console.error('Error al buscar administrador:', err);
        return null;
      });

      if (!existingAdmin) {
        const userData = {
          email: adminEmail,
          nombre: adminName,
          apellido: adminLastName,
          password: adminPassword,
          role: 'admin',
          activo: true,
        };
        const newAdmin = await this.usersService.create(userData);
        console.log('Administrador predeterminado creado:', {
          id: newAdmin.id,
          email: newAdmin.email,
          role: newAdmin.role,
        });
      } else {
        if (existingAdmin.role !== 'admin') {
          await this.usersService.update(existingAdmin.id, { role: 'admin' });
          console.log('Rol de administrador asignado a:', adminEmail);
        } else {
          console.log('Administrador ya existe con rol correcto:', adminEmail);
        }
      }
    } catch (error) {
      console.error('Error en onModuleInit al configurar administrador:', error);
    }
  }

  // Registro de usuario
  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create({
        email: registerDto.email,
        nombre: registerDto.nombre,
        apellido: registerDto.apellido,
        password: registerDto.password,
        role: registerDto.role || 'user',
      });
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

  // Login general
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas desde servidor');
    }

    if (!user.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

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

  // Login de administrador
  async adminLogin(loginDto: LoginDto) {
    console.log('Intentando login de admin con email:', loginDto.email);
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      console.log('Usuario no encontrado para:', loginDto.email);
      throw new UnauthorizedException('Credenciales inválidas desde servidor');
    }

    console.log('Usuario encontrado:', { id: user.id, email: user.email, role: user.role, activo: user.activo });

    if (!user.activo) {
      console.log('Usuario inactivo:', user.email);
      throw new UnauthorizedException('Usuario inactivo');
    }

    if (user.role !== 'admin') {
      console.log('Rol incorrecto para:', user.email, 'Rol actual:', user.role);
      throw new UnauthorizedException('No tienes permisos de administrador');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );
    console.log('Contraseña válida:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Contraseña inválida para:', loginDto.email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      mensaje: 'Login de administrador exitoso',
      usuario: { id: user.id, email: user.email, nombre: user.nombre, apellido: user.apellido, role: user.role },
      access_token: token,
    };
  }

  // Validación de usuario
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user && await this.usersService.validatePassword(password, user.password)) {
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
    return null;
  }

  // Perfil del usuario
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

  // Envío de código de recuperación
  async sendResetCode(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('Email no encontrado en nuestra base de datos', HttpStatus.NOT_FOUND);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await this.usersService.updateResetToken(user.id, hashedCode, expiry);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
      },
    });

    await transporter.sendMail({
      from: `"Tu App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Código de Recuperación de Contraseña',
      text: `Tu código de verificación es: ${code}. Este código expira en 10 minutos. No compartas este código con nadie.`,
      html: `<p>Tu código de verificación es: <strong>${code}</strong></p><p>Este código expira en 10 minutos. No compartas este código con nadie.</p>`,
    });

    return { success: true, message: 'Código enviado exitosamente a tu correo electrónico.' };
  }

  // Verificación de código de recuperación
  async verifyResetCode(verifyCodeDto: VerifyCodeDto) {
    const { email, code } = verifyCodeDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('Email no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!user.resetToken || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new HttpException('Código inválido o expirado. Solicita un nuevo código.', HttpStatus.BAD_REQUEST);
    }

    const isValid: boolean = await bcrypt.compare(code, user.resetToken);

    if (!isValid) {
      throw new HttpException('Código incorrecto. Verifica e intenta de nuevo.', HttpStatus.BAD_REQUEST);
    }

    return { success: true, message: 'Código verificado correctamente. Puedes restablecer tu contraseña.' };
  }

  // Restablecimiento de contraseña
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword } = resetPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('Email no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!user.resetToken || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new HttpException('No hay un proceso de recuperación activo. Solicita un nuevo código.', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePasswordAndClearToken(user.id, hashedPassword);

    return { success: true, message: 'Contraseña restablecida exitosamente. Puedes iniciar sesión ahora.' };
  }

  // Método auxiliar para hashear contraseñas (si no está en UsersService)
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}