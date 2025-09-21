import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async findByCategory(category: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: { category, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findLowStock(): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.stockQuantity <= product.minimumStock')
      .andWhere('product.isActive = :isActive', { isActive: true })
      .orderBy('product.stockQuantity', 'ASC')
      .getMany();
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);

    if (product.stockQuantity + quantity < 0) {
      throw new BadRequestException('Estoque insuficiente');
    }

    product.stockQuantity += quantity;
    return await this.productRepository.save(product);
  }
}
