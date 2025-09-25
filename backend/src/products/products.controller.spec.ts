import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCategory: jest.fn(),
    findLowStock: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Produto Teste',
        description: 'Descrição do produto teste',
        stockQuantity: 100,
        minimumStock: 10,
        category: 'Categoria Teste',
        unit: 'un',
        isActive: true,
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(service.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products when no category is provided', async () => {
      const mockProducts = [mockProduct];
      mockProductsService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(service.findByCategory).not.toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('should return products by category when category is provided', async () => {
      const category = 'Categoria Teste';
      const mockProducts = [mockProduct];
      mockProductsService.findByCategory.mockResolvedValue(mockProducts);

      const result = await controller.findAll(category);

      expect(service.findByCategory).toHaveBeenCalledWith(category);
      expect(service.findAll).not.toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('findLowStock', () => {
    it('should return products with low stock', async () => {
      const lowStockProducts = [
        { ...mockProduct, stockQuantity: 5, minimumStock: 10 },
      ];
      mockProductsService.findLowStock.mockResolvedValue(lowStockProducts);

      const result = await controller.findLowStock();

      expect(service.findLowStock).toHaveBeenCalled();
      expect(result).toEqual(lowStockProducts);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(mockProduct.id);

      expect(service.findOne).toHaveBeenCalledWith(mockProduct.id);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductsService.findOne.mockRejectedValue(
        new NotFoundException('Produto não encontrado'),
      );

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Produto Atualizado',
        description: 'Nova descrição',
      };

      const updatedProduct = { ...mockProduct, ...updateProductDto };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(mockProduct.id, updateProductDto);

      expect(service.update).toHaveBeenCalledWith(
        mockProduct.id,
        updateProductDto,
      );
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException when trying to update non-existent product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Produto Atualizado',
      };

      mockProductsService.update.mockRejectedValue(
        new NotFoundException('Produto não encontrado'),
      );

      await expect(
        controller.update('non-existent-id', updateProductDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockProduct.id);

      expect(service.remove).toHaveBeenCalledWith(mockProduct.id);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when trying to remove non-existent product', async () => {
      mockProductsService.remove.mockRejectedValue(
        new NotFoundException('Produto não encontrado'),
      );

      await expect(controller.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
