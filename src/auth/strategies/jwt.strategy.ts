import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

export interface JwtPayload {
  sub: number; // subject (ID del usuario)
  email: string;
  role: string;
  iat?: number; // issued at
  exp?: number; // expiration time
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService,
             
  ) {
    const SECRET: string =process.env.JWT_SECRET || 'fallback-secret';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    // Este método se ejecuta automáticamente cuando el token es válido
    const user = await this.usersService.findById(payload.sub);
    
    if (!user || !user.activo) {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }

    // El objeto retornado se asigna a request.user
    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      role: user.role,
    };
  }
}