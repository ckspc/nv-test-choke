import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/product.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getProductById(@Param('id') id: string): Promise<Product> {
    return this.productService.findById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createProduct(@Body() productDto: CreateProductDto): Promise<Product> {
    return this.productService.create(productDto);
  }
}
