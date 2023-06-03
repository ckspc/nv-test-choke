import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductService,
    private readonly authService: AuthService,
  ) {}

  async createOrder(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<Order> {
    const product = await this.productService.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const totalPrice = product.price * quantity;

    const order = new Order();
    order.userId = userId;
    order.product = product;
    order.quantity = quantity;
    order.totalPrice = totalPrice;

    return this.orderRepository.save(order);
  }

  async cancelOrder(orderId: number, userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.is_canceled) {
      throw new ConflictException('Order is already canceled');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to cancel this order',
      );
    }

    order.is_canceled = true;
    return this.orderRepository.save(order);
  }

  async getOrderDetails(orderId: string, userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id: Number(orderId),
      },
    });

    if (!order) {
      throw new NotFoundException();
    }

    if (order.userId !== userId) {
      throw new UnauthorizedException();
    }

    return order;
  }
}
