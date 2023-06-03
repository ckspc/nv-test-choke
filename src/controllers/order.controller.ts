import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Get,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateOrderDto } from '../dtos/order.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OrderService } from '../services/order.service';
import { Order } from '../entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly authService: AuthService,
    private readonly orderService: OrderService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: any,
  ): Promise<Order> {
    const userId = req.user.id;
    const { productId, quantity } = createOrderDto;
    return this.orderService.createOrder(userId, productId, quantity);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  async cancelOrder(@Param('id') orderId: number, @Request() req: any) {
    const userId = req.user.id;
    return this.orderService.cancelOrder(orderId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOrderDetails(@Param('id') orderId: string, @Request() req: any) {
    const userId = req.user.id;

    try {
      const order = await this.orderService.getOrderDetails(orderId, userId);
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Order not found');
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(
          'You do not have permission to view this order',
        );
      } else {
        throw error;
      }
    }
  }
}
