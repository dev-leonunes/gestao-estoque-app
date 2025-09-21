import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Movement, MovementType } from './entities/movement.entity';
import { Product } from '../products/entities/product.entity';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createMovementDto: CreateMovementDto): Promise<Movement> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar se o produto existe
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: createMovementDto.productId },
      });

      if (!product) {
        throw new NotFoundException('Produto não encontrado');
      }

      // Calcular a quantidade que será adicionada ou removida do estoque
      const stockChange =
        createMovementDto.type === MovementType.IN
          ? createMovementDto.quantity
          : -createMovementDto.quantity;

      // Verificar se há estoque suficiente para saídas
      if (
        createMovementDto.type === MovementType.OUT &&
        product.stockQuantity < createMovementDto.quantity
      ) {
        throw new BadRequestException(
          'Estoque insuficiente para esta operação',
        );
      }

      // Criar a movimentação
      const movement = queryRunner.manager.create(Movement, createMovementDto);
      await queryRunner.manager.save(movement);

      // Atualizar o estoque do produto
      product.stockQuantity += stockChange;
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();

      // Buscar a movimentação criada com as relações
      return await this.movementRepository.findOne({
        where: { id: movement.id },
        relations: ['product'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Movement[]> {
    return await this.movementRepository.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Movement> {
    const movement = await this.movementRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!movement) {
      throw new NotFoundException('Movimentação não encontrada');
    }

    return movement;
  }

  async update(
    id: string,
    updateMovementDto: UpdateMovementDto,
  ): Promise<Movement> {
    const movement = await this.findOne(id);

    Object.assign(movement, updateMovementDto);
    return await this.movementRepository.save(movement);
  }

  async remove(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const movement = await queryRunner.manager.findOne(Movement, {
        where: { id },
        relations: ['product'],
      });

      if (!movement) {
        throw new NotFoundException('Movimentação não encontrada');
      }

      // Reverter o movimento no estoque
      const stockChange =
        movement.type === MovementType.IN
          ? -movement.quantity
          : movement.quantity;

      // Verificar se a reversão não deixará o estoque negativo
      if (movement.product.stockQuantity + stockChange < 0) {
        throw new BadRequestException(
          'Não é possível excluir esta movimentação pois deixaria o estoque negativo',
        );
      }

      // Atualizar o estoque
      movement.product.stockQuantity += stockChange;
      await queryRunner.manager.save(movement.product);

      // Remover a movimentação
      await queryRunner.manager.remove(movement);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByProduct(productId: string): Promise<Movement[]> {
    return await this.movementRepository.find({
      where: { productId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: MovementType): Promise<Movement[]> {
    return await this.movementRepository.find({
      where: { type },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async getMovementsSummary(startDate?: Date, endDate?: Date) {
    const query = this.movementRepository
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.product', 'product');

    if (startDate) {
      query.andWhere('movement.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('movement.createdAt <= :endDate', { endDate });
    }

    const movements = await query
      .orderBy('movement.createdAt', 'DESC')
      .getMany();

    const summary = {
      totalMovements: movements.length,
      totalIn: movements.filter((m) => m.type === MovementType.IN).length,
      totalOut: movements.filter((m) => m.type === MovementType.OUT).length,
      totalQuantityIn: movements
        .filter((m) => m.type === MovementType.IN)
        .reduce((sum, m) => sum + m.quantity, 0),
      totalQuantityOut: movements
        .filter((m) => m.type === MovementType.OUT)
        .reduce((sum, m) => sum + m.quantity, 0),
      movements,
    };

    return summary;
  }
}
