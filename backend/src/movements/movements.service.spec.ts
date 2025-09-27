import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, getDataSourceToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { Movement, MovementType } from './entities/movement.entity';
import { Product } from '../products/entities/product.entity';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';

describe('MovementsService', () => {
  let service: MovementsService;
  let movementRepository: Repository<Movement>;

  const mockMovementRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
    remove: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn().mockResolvedValue(undefined),
    startTransaction: jest.fn().mockResolvedValue(undefined),
    commitTransaction: jest.fn().mockResolvedValue(undefined),
    rollbackTransaction: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
    manager: {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  const mockProduct: Product = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Produto Teste',
    description: 'Descrição do produto teste',
    stockQuantity: 100,
    minimumStock: 10,
    category: 'Categoria Teste',
    unit: 'un',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  };

  const mockMovement: Movement = {
    id: '456e7890-e89b-12d3-a456-426614174001',
    type: MovementType.IN,
    quantity: 50,
    description: 'Entrada de estoque',
    reference: 'REF001',
    productId: mockProduct.id,
    product: mockProduct,
    createdAt: new Date('2023-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovementsService,
        {
          provide: getRepositoryToken(Movement),
          useValue: mockMovementRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<MovementsService>(MovementsService);
    movementRepository = module.get<Repository<Movement>>(
      getRepositoryToken(Movement),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    beforeEach(() => {
      mockQueryRunner.connect.mockResolvedValue(undefined);
      mockQueryRunner.startTransaction.mockResolvedValue(undefined);
      mockQueryRunner.commitTransaction.mockResolvedValue(undefined);
      mockQueryRunner.rollbackTransaction.mockResolvedValue(undefined);
      mockQueryRunner.release.mockResolvedValue(undefined);
    });

    it('should create a movement with type IN and update stock', async () => {
      const createMovementDto: CreateMovementDto = {
        type: MovementType.IN,
        quantity: 50,
        description: 'Entrada de estoque',
        reference: 'REF001',
        productId: mockProduct.id,
      };

      const updatedProduct = { ...mockProduct, stockQuantity: 150 };
      const createdMovement = { ...mockMovement };

      mockQueryRunner.manager.findOne.mockResolvedValue(mockProduct);
      mockQueryRunner.manager.create.mockReturnValue(createdMovement);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(createdMovement)
        .mockResolvedValueOnce(updatedProduct);

      mockMovementRepository.findOne.mockResolvedValue(createdMovement);

      const result = await service.create(createMovementDto);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(Product, {
        where: { id: createMovementDto.productId },
      });
      expect(mockQueryRunner.manager.create).toHaveBeenCalledWith(
        Movement,
        createMovementDto,
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(result).toEqual(createdMovement);
    });

    it('should create a movement with type OUT and update stock', async () => {
      const createMovementDto: CreateMovementDto = {
        type: MovementType.OUT,
        quantity: 30,
        description: 'Saída de estoque',
        reference: 'REF002',
        productId: mockProduct.id,
      };

      const updatedProduct = { ...mockProduct, stockQuantity: 70 };
      const createdMovement = {
        ...mockMovement,
        type: MovementType.OUT,
        quantity: 30,
      };

      mockQueryRunner.manager.findOne.mockResolvedValue(mockProduct);
      mockQueryRunner.manager.create.mockReturnValue(createdMovement);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(createdMovement)
        .mockResolvedValueOnce(updatedProduct);

      mockMovementRepository.findOne.mockResolvedValue(createdMovement);

      const result = await service.create(createMovementDto);

      expect(result).toEqual(createdMovement);
    });

    it('should throw NotFoundException when product not found', async () => {
      const createMovementDto: CreateMovementDto = {
        type: MovementType.IN,
        quantity: 50,
        description: 'Entrada de estoque',
        productId: 'non-existent-id',
      };

      mockQueryRunner.manager.findOne.mockResolvedValue(null);

      await expect(service.create(createMovementDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createMovementDto)).rejects.toThrow(
        'Produto não encontrado',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should throw BadRequestException when insufficient stock for OUT movement', async () => {
      const createMovementDto: CreateMovementDto = {
        type: MovementType.OUT,
        quantity: 150, // Mais do que existe em estoque
        description: 'Saída de estoque',
        productId: mockProduct.id,
      };

      mockQueryRunner.manager.findOne.mockResolvedValue(mockProduct);

      await expect(service.create(createMovementDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createMovementDto)).rejects.toThrow(
        'Estoque insuficiente para esta operação',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all movements', async () => {
      const mockMovements = [mockMovement];
      mockMovementRepository.find.mockResolvedValue(mockMovements);

      const result = await service.findAll();

      expect(movementRepository.find).toHaveBeenCalledWith({
        relations: ['product'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockMovements);
    });
  });

  describe('findOne', () => {
    it('should return a movement when found', async () => {
      mockMovementRepository.findOne.mockResolvedValue(mockMovement);

      const result = await service.findOne(mockMovement.id);

      expect(movementRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockMovement.id },
        relations: ['product'],
      });
      expect(result).toEqual(mockMovement);
    });

    it('should throw NotFoundException when movement not found', async () => {
      mockMovementRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Movimentação não encontrada',
      );
    });
  });

  describe('update', () => {
    it('should update a movement', async () => {
      const updateMovementDto: UpdateMovementDto = {
        description: 'Descrição atualizada',
      };

      const updatedMovement = { ...mockMovement, ...updateMovementDto };

      mockMovementRepository.findOne.mockResolvedValue(mockMovement);
      mockMovementRepository.save.mockResolvedValue(updatedMovement);

      const result = await service.update(mockMovement.id, updateMovementDto);

      expect(movementRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockMovement.id },
        relations: ['product'],
      });
      expect(movementRepository.save).toHaveBeenCalledWith(updatedMovement);
      expect(result).toEqual(updatedMovement);
    });

    it('should update only specified fields and preserve others', async () => {
      const updateMovementDto: UpdateMovementDto = {
        reference: 'REF002', // Apenas atualizando referência
      };

      const originalMovement = { ...mockMovement };
      const expectedUpdatedMovement = {
        ...originalMovement,
        reference: 'REF002',
      };

      mockMovementRepository.findOne.mockResolvedValue(originalMovement);
      mockMovementRepository.save.mockResolvedValue(expectedUpdatedMovement);

      const result = await service.update(mockMovement.id, updateMovementDto);

      expect(movementRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockMovement.id },
        relations: ['product'],
      });

      // Verificar que apenas os campos fornecidos foram atualizados
      const savedMovement = mockMovementRepository.save.mock.calls[0][0];
      expect(savedMovement.reference).toBe('REF002');
      expect(savedMovement.description).toBe(originalMovement.description); // Deve manter valor original
      expect(savedMovement.type).toBe(originalMovement.type); // Deve manter valor original
      expect(savedMovement.quantity).toBe(originalMovement.quantity); // Deve manter valor original
      expect(result).toEqual(expectedUpdatedMovement);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      mockQueryRunner.connect.mockResolvedValue(undefined);
      mockQueryRunner.startTransaction.mockResolvedValue(undefined);
      mockQueryRunner.commitTransaction.mockResolvedValue(undefined);
      mockQueryRunner.rollbackTransaction.mockResolvedValue(undefined);
      mockQueryRunner.release.mockResolvedValue(undefined);
    });

    it('should remove a movement and revert stock changes', async () => {
      const movementToRemove = {
        ...mockMovement,
        type: MovementType.IN,
        quantity: 50,
      };
      // Para um movimento IN de 50, a reversão seria -50, então: 100 + (-50) = 50
      const productBeforeRemoval = { ...mockProduct, stockQuantity: 100 };
      movementToRemove.product = productBeforeRemoval;

      // Após a reversão: stockQuantity se torna 50
      const updatedProduct = { ...productBeforeRemoval, stockQuantity: 50 };

      mockQueryRunner.manager.findOne.mockResolvedValue(movementToRemove);
      mockQueryRunner.manager.save.mockResolvedValue(updatedProduct);
      mockQueryRunner.manager.remove.mockResolvedValue(movementToRemove);

      await service.remove(mockMovement.id);

      expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(Movement, {
        where: { id: mockMovement.id },
        relations: ['product'],
      });

      // Verificar se o produto foi salvo com o estoque atualizado
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        expect.objectContaining({ stockQuantity: 50 }),
      );
      expect(mockQueryRunner.manager.remove).toHaveBeenCalledWith(
        movementToRemove,
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException when movement not found', async () => {
      mockQueryRunner.manager.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove('non-existent-id')).rejects.toThrow(
        'Movimentação não encontrada',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException when reverting would make stock negative', async () => {
      const movementToRemove = {
        ...mockMovement,
        type: MovementType.OUT,
        quantity: 150, // Movimento de saída de 150
      };
      // Produto com estoque de 10, reverter saída de 150 significaria +150, totalizando 160
      // Mas vamos simular um caso onde o estoque atual é muito baixo
      const productWithLowStock = { ...mockProduct, stockQuantity: 10 };
      movementToRemove.product = productWithLowStock;

      // O teste deve simular que quando tentamos reverter uma saída de 150
      // em um produto que tem apenas 10 de estoque, isso deveria dar erro
      // Mas na verdade, reverter uma saída ADICIONA ao estoque...
      // Vou ajustar para simular um cenário real onde faria sentido dar erro

      // Na verdade, vou remover este teste pois a lógica no serviço
      // para saída significa que reverter adiciona estoque, não remove
      // Vou criar um cenário onde realmente daria erro

      const movementIn = {
        ...mockMovement,
        type: MovementType.IN,
        quantity: 150, // Movimento de entrada de 150
      };
      // Se o estoque atual é 10 e tentamos reverter uma entrada de 150,
      // o cálculo seria: 10 + (-150) = -140, que é negativo
      const productWithStock = { ...mockProduct, stockQuantity: 10 };
      movementIn.product = productWithStock;

      mockQueryRunner.manager.findOne.mockResolvedValue(movementIn);

      await expect(service.remove(mockMovement.id)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.remove(mockMovement.id)).rejects.toThrow(
        'Não é possível excluir esta movimentação pois deixaria o estoque negativo',
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('findByProduct', () => {
    it('should return movements by product', async () => {
      const mockMovements = [mockMovement];
      mockMovementRepository.find.mockResolvedValue(mockMovements);

      const result = await service.findByProduct(mockProduct.id);

      expect(movementRepository.find).toHaveBeenCalledWith({
        where: { productId: mockProduct.id },
        relations: ['product'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockMovements);
    });
  });

  describe('findByType', () => {
    it('should return movements by type', async () => {
      const mockMovements = [mockMovement];
      mockMovementRepository.find.mockResolvedValue(mockMovements);

      const result = await service.findByType(MovementType.IN);

      expect(movementRepository.find).toHaveBeenCalledWith({
        where: { type: MovementType.IN },
        relations: ['product'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockMovements);
    });
  });

  describe('getMovementsSummary', () => {
    it('should return movements summary without date filters', async () => {
      const mockMovements = [
        { ...mockMovement, type: MovementType.IN, quantity: 50 },
        { ...mockMovement, type: MovementType.OUT, quantity: 30 },
        { ...mockMovement, type: MovementType.IN, quantity: 20 },
      ];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockMovements),
      };

      mockMovementRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getMovementsSummary();

      expect(result).toEqual({
        totalMovements: 3,
        totalIn: 2,
        totalOut: 1,
        totalQuantityIn: 70,
        totalQuantityOut: 30,
        movements: mockMovements,
      });
    });

    it('should return movements summary with date filters', async () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-12-31');
      const mockMovements = [mockMovement];

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockMovements),
      };

      mockMovementRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );

      const result = await service.getMovementsSummary(startDate, endDate);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'movement.createdAt >= :startDate',
        { startDate },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'movement.createdAt <= :endDate',
        { endDate },
      );
      expect(result.totalMovements).toBe(1);
    });
  });
});
