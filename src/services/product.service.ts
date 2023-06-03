import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }
  async findById(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id } });
  }

  async create(productDto: CreateProductDto): Promise<Product> {
    const product = new Product();
    product.name = productDto.name;
    product.description = productDto.description;
    product.price = productDto.price;
    return this.productRepository.save(product);
  }
}
