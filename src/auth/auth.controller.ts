import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from '../auth/dto/forgot-password.dto';
import { VerifyCodeDto } from '../auth/dto/verify-code.dto';
import { ResetPasswordDto } from '../auth/dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

// Interfaz para tipear correctamente las requests autenticadas
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Public()
  @Post('admin-login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body(ValidationPipe) loginDto: LoginDto) {
    const result = await this.authService.adminLogin(loginDto);
    return result;
  }

  @Public()
  @Post('forgot-password/send')
  @HttpCode(HttpStatus.OK)
  async sendResetCode(@Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.sendResetCode(forgotPasswordDto);
  }

  @Public()
  @Post('forgot-password/verify')
  @HttpCode(HttpStatus.OK)
  async verifyResetCode(@Body(ValidationPipe) verifyCodeDto: VerifyCodeDto) {
    return await this.authService.verifyResetCode(verifyCodeDto);
  }

  @Public()
  @Post('forgot-password/reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body(ValidationPipe) resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    // Verificación de seguridad para evitar errores
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.authService.getProfile(Number(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  validateToken(@Request() req: AuthenticatedRequest) {
    // Removido 'async' ya que no se usa 'await'
    return {
      mensaje: 'Token válido',
      usuario: req.user,
    };
  }
}