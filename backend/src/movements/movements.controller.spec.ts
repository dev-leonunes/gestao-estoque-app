import { Test, TestingModule } from '@nestjs/testing';
import { MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { Movement, MovementType } from './entities/movement.entity';
import { Product } from '../products/entities/product.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MovementsController', () => {
  let controller: MovementsController;
  let service: MovementsService;

  const mockMovementsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByType: jest.fn(),
    findByProduct: jest.fn(),
    getMovementsSummary: jest.fn(),
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
      controllers: [MovementsController],
      providers: [
        {
          provide: MovementsService,
          useValue: mockMovementsService,
        },
      ],
    }).compile();

    controller = module.get<MovementsController>(MovementsController);
    service = module.get<MovementsService>(MovementsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movement', async () => {
      const createMovementDto: CreateMovementDto = {
        type: MovementType.IN,
        quantity: 50,
        description: 'Entrada de estoque',
        reference: 'REF001',
        productId: mockProduct.id,
      };

      mockMovementsService.create.mockResolvedValue(mockMovement);

      const result = await controller.create(createMovementDto);

      expect(service.create).toHaveBeenCalledWith(createMovementDto);
      expect(result).toEqual(mockMovement);
    });

    it('should throw NotFoundException when product not found', async () => {
      const createMovementDto: CreateMovementDto = {
        type: MovementType.IN,
        quantity: 50,
        description: 'Entrada de estoque',
        productId: 'non-existent-id',
      };

      mockMovementsService.create.mockRejectedValue(
        new NotFoundException('Produto não encontrado'),
      );

      await expect(controller.create(createMovementDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      const createMovementDto: CreateMovementDto = {
        type: MovementType.OUT,
        quantity: 200,
        description: 'Saída de estoque',
        productId: mockProduct.id,
      };

      mockMovementsService.create.mockRejectedValue(
        new BadRequestException('Estoque insuficiente para esta operação'),
      );

      await expect(controller.create(createMovementDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all movements when no filters are provided', async () => {
      const mockMovements = [mockMovement];
      mockMovementsService.findAll.mockResolvedValue(mockMovements);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(service.findByType).not.toHaveBeenCalled();
      expect(service.findByProduct).not.toHaveBeenCalled();
      expect(result).toEqual(mockMovements);
    });

    it('should return movements by type when type filter is provided', async () => {
      const mockMovements = [mockMovement];
      mockMovementsService.findByType.mockResolvedValue(mockMovements);

      const result = await controller.findAll(MovementType.IN);

      expect(service.findByType).toHaveBeenCalledWith(MovementType.IN);
      expect(service.findAll).not.toHaveBeenCalled();
      expect(service.findByProduct).not.toHaveBeenCalled();
      expect(result).toEqual(mockMovements);
    });

    it('should return movements by product when productId filter is provided', async () => {
      const mockMovements = [mockMovement];
      mockMovementsService.findByProduct.mockResolvedValue(mockMovements);

      const result = await controller.findAll(undefined, mockProduct.id);

      expect(service.findByProduct).toHaveBeenCalledWith(mockProduct.id);
      expect(service.findAll).not.toHaveBeenCalled();
      expect(service.findByType).not.toHaveBeenCalled();
      expect(result).toEqual(mockMovements);
    });

    it('should prioritize type filter over productId when both are provided', async () => {
      const mockMovements = [mockMovement];
      mockMovementsService.findByType.mockResolvedValue(mockMovements);

      const result = await controller.findAll(MovementType.IN, mockProduct.id);

      expect(service.findByType).toHaveBeenCalledWith(MovementType.IN);
      expect(service.findByProduct).not.toHaveBeenCalled();
      expect(service.findAll).not.toHaveBeenCalled();
      expect(result).toEqual(mockMovements);
    });
  });

  describe('getMovementsSummary', () => {
    it('should return movements summary without date filters', async () => {
      const mockSummary = {
        totalMovements: 3,
        totalIn: 2,
        totalOut: 1,
        totalQuantityIn: 70,
        totalQuantityOut: 30,
        movements: [mockMovement],
      };

      mockMovementsService.getMovementsSummary.mockResolvedValue(mockSummary);

      const result = await controller.getMovementsSummary();

      expect(service.getMovementsSummary).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
      expect(result).toEqual(mockSummary);
    });

    it('should return movements summary with date filters', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-12-31';
      const mockSummary = {
        totalMovements: 1,
        totalIn: 1,
        totalOut: 0,
        totalQuantityIn: 50,
        totalQuantityOut: 0,
        movements: [mockMovement],
      };

      mockMovementsService.getMovementsSummary.mockResolvedValue(mockSummary);

      const result = await controller.getMovementsSummary(startDate, endDate);

      expect(service.getMovementsSummary).toHaveBeenCalledWith(
        new Date(startDate),
        new Date(endDate),
      );
      expect(result).toEqual(mockSummary);
    });

    it('should handle invalid date strings gracefully', async () => {
      const startDate = 'invalid-date';
      const endDate = '2023-12-31';
      const mockSummary = {
        totalMovements: 1,
        totalIn: 1,
        totalOut: 0,
        totalQuantityIn: 50,
        totalQuantityOut: 0,
        movements: [mockMovement],
      };

      mockMovementsService.getMovementsSummary.mockResolvedValue(mockSummary);

      const result = await controller.getMovementsSummary(startDate, endDate);

      // Deve chamar com undefined para data inválida e Date válida para data válida
      expect(service.getMovementsSummary).toHaveBeenCalledWith(
        undefined, // startDate inválida vira undefined
        new Date('2023-12-31'), // endDate válida
      );
      expect(result).toEqual(mockSummary);
    });

    it('should handle both invalid dates gracefully', async () => {
      const startDate = 'invalid-start';
      const endDate = 'invalid-end';
      const mockSummary = {
        totalMovements: 0,
        totalIn: 0,
        totalOut: 0,
        totalQuantityIn: 0,
        totalQuantityOut: 0,
        movements: [],
      };

      mockMovementsService.getMovementsSummary.mockResolvedValue(mockSummary);

      const result = await controller.getMovementsSummary(startDate, endDate);

      // Ambas as datas inválidas devem virar undefined
      expect(service.getMovementsSummary).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
      expect(result).toEqual(mockSummary);
    });
  });

  describe('findOne', () => {
    it('should return a movement by id', async () => {
      mockMovementsService.findOne.mockResolvedValue(mockMovement);

      const result = await controller.findOne(mockMovement.id);

      expect(service.findOne).toHaveBeenCalledWith(mockMovement.id);
      expect(result).toEqual(mockMovement);
    });

    it('should throw NotFoundException when movement not found', async () => {
      mockMovementsService.findOne.mockRejectedValue(
        new NotFoundException('Movimentação não encontrada'),
      );

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a movement', async () => {
      const updateMovementDto: UpdateMovementDto = {
        description: 'Descrição atualizada',
        reference: 'REF002',
      };

      const updatedMovement = { ...mockMovement, ...updateMovementDto };
      mockMovementsService.update.mockResolvedValue(updatedMovement);

      const result = await controller.update(
        mockMovement.id,
        updateMovementDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        mockMovement.id,
        updateMovementDto,
      );
      expect(result).toEqual(updatedMovement);
    });

    it('should throw NotFoundException when trying to update non-existent movement', async () => {
      const updateMovementDto: UpdateMovementDto = {
        description: 'Descrição atualizada',
      };

      mockMovementsService.update.mockRejectedValue(
        new NotFoundException('Movimentação não encontrada'),
      );

      await expect(
        controller.update('non-existent-id', updateMovementDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a movement', async () => {
      mockMovementsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockMovement.id);

      expect(service.remove).toHaveBeenCalledWith(mockMovement.id);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when trying to remove non-existent movement', async () => {
      mockMovementsService.remove.mockRejectedValue(
        new NotFoundException('Movimentação não encontrada'),
      );

      await expect(controller.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when removal would make stock negative', async () => {
      mockMovementsService.remove.mockRejectedValue(
        new BadRequestException(
          'Não é possível excluir esta movimentação pois deixaria o estoque negativo',
        ),
      );

      await expect(controller.remove(mockMovement.id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
