import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { ProductosModule } from './productos/productos.module'; 
import { VentaModule } from './venta/venta.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';
import { CompraModule } from './compra/compra.module';
import { DetalleCompraModule } from './detalle-compra/detalle-compra.module';
import { CarritoCompraModule } from './carrito-compra/carrito-compra.module';
import { DetalleCarritoModule } from './detalle-carrito/detalle-carrito.module';
import { InventarioMovimientoModule } from './inventario-movimiento/inventario-movimiento.module';
import { DevolucionVentaModule } from './devolucion-venta/devolucion-venta.module';
import { DetalleDevolucionVentaModule } from './detalle-devolucion-venta/detalle-devolucion-venta.module';
import { DevolucionCompraModule } from './devolucion-compra/devolucion-compra.module';
import { DetalleDevolucionCompraModule } from './detalle-devolucion-compra/detalle-devolucion-compra.module';
import { CategoriaModule } from './categoria/categoria.module';


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
        password: configService.get<string>('DB_PASSWORD') || '',
        database: configService.get<string>('DB_DATABASE') || 'brazzino',
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
    ProductosModule,
    VentaModule,
    DetalleVentaModule,
    CompraModule,
    DetalleCompraModule,
    CarritoCompraModule,
    DetalleCarritoModule,
    InventarioMovimientoModule,
    DevolucionVentaModule,
    DetalleDevolucionVentaModule,
    DevolucionCompraModule,
    DetalleDevolucionCompraModule,
    CategoriaModule
    
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