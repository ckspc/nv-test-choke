import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { DatabaseService } from './services/database.service';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    PassportModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'nv_test_db',
      entities: [User, Product, Order],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Product, Order]),
  ],
  controllers: [AuthController, ProductController, OrderController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    DatabaseService,
    ProductService,
    OrderService,
  ],
})
export class AppModule {}
