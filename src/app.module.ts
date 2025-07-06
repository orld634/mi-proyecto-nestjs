import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ProveedoresModule } from './proveedores/proveedores.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: 3306,
        username: configService.get<string>('DB_USERNAME') || 'root',
        password: configService.get<string>('DB_PASSWORD') || 'root',
        database: configService.get<string>('DB_DATABASE') || 'brazzinos',
        autoLoadEntities: true,
        synchronize: true, // Solo en desarrollo
        connectTimeout: 60000,
        acquireTimeout: 60000,
        retryAttempts: 3,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProveedoresModule,
  ],
  controllers: [],
  providers: [
   /* {
   //   provide: APP_GUARD,
    //  useClass: JwtAuthGuard, // Guard global para toda la aplicación
    },*/
  ],
})
export class AppModule {}