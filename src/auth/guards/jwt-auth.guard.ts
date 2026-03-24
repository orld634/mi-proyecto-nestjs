/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'; // ajusta la ruta si es diferente

interface ValidatedUser {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  role: string;
}

interface AuthenticatedRequest {
  user?: ValidatedUser;
  route?: { path: string };
  path?: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // ✅ NUEVO: Verificar si la ruta es pública ANTES de validar el token
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // ← Deja pasar sin verificar token
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: any): any {
    if (err || !user) {
      throw new UnauthorizedException('Token no válido o expirado');
    }

    const request = context.switchToHttp().getRequest();
    const routePath = String(request?.route?.path ?? request?.path ?? '');

    const isAdminRoute =
      routePath.startsWith('/admin') || routePath === '/auth/admin-login';

    const validatedUser = user as ValidatedUser;
    if (isAdminRoute && validatedUser.role !== 'admin') {
      throw new UnauthorizedException('Se requiere rol de administrador');
    }

    return user;
  }
}