/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Interfaz para el usuario que retorna el validate() de jwt.strategy.ts
interface ValidatedUser {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  role: string;
}

// Interfaz para el request autenticado
interface AuthenticatedRequest {
  user?: ValidatedUser;
  route?: {
    path: string;
  };
  path?: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any): any {
    if (err || !user) {
      throw new UnauthorizedException('Token no válido o expirado');
    }

    // Obtener request de forma segura
    const request = context.switchToHttp().getRequest();
    const routePath = String(request?.route?.path ?? request?.path ?? '');

    // Detectar rutas admin (ajusta según tus rutas reales si hace falta)
    const isAdminRoute =
      routePath.startsWith('/admin') || routePath === '/auth/admin-login';

    // Verificar rol
    const validatedUser = user as ValidatedUser;
    if (isAdminRoute && validatedUser.role !== 'admin') {
      throw new UnauthorizedException('Se requiere rol de administrador');
    }

    // Devolver el user tal cual (Passport/Nest se encarga del resto)
    return user;
  }
}