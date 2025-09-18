import { Injectable, UnauthorizedException, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create(registerDto);
      console.log(user);

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

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user && await this.usersService.validatePassword(password, user.password)) {
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Nuevo método: Enviar código de recuperación
  async sendResetCode(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('Email no encontrado en nuestra base de datos', HttpStatus.NOT_FOUND);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
    const hashedCode = await bcrypt.hash(code, 10); // Hash para almacenar
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // Expira en 10 minutos

    // Actualizar usuario con el token y fecha de expiración
    await this.usersService.updateResetToken(user.id, hashedCode, expiry);

    // Configuración de nodemailer con tipos correctos
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true para puerto 465, false para otros
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

    // Envío del email
    await transporter.sendMail({
      from: `"Tu App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Código de Recuperación de Contraseña',
      text: `Tu código de verificación es: ${code}. Este código expira en 10 minutos. No compartas este código con nadie.`,
      html: `<p>Tu código de verificación es: <strong>${code}</strong></p><p>Este código expira en 10 minutos. No compartas este código con nadie.</p>`,
    });

    return { success: true, message: 'Código enviado exitosamente a tu correo electrónico.' };
  }

  // Nuevo método: Verificar código
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

  // Nuevo método: Restablecer contraseña
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, newPassword } = resetPasswordDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException('Email no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!user.resetToken || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new HttpException('No hay un proceso de recuperación activo. Solicita un nuevo código.', HttpStatus.BAD_REQUEST);
    }

    // Validar y hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePasswordAndClearToken(user.id, hashedPassword);

    return { success: true, message: 'Contraseña restablecida exitosamente. Puedes iniciar sesión ahora.' };
  }
}