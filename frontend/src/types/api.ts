export const MovementType = {
  IN: 'IN',
  OUT: 'OUT',
} as const;

export type MovementType = typeof MovementType[keyof typeof MovementType];

export interface Product {
  id: string;
  name: string;
  description?: string;
  stockQuantity: number;
  minimumStock: number;
  category?: string;
  unit?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Movement {
  id: string;
  type: MovementType;
  quantity: number;
  description?: string;
  reference?: string;
  productId: string;
  product?: Product;
  createdAt: Date;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  stockQuantity?: number;
  minimumStock?: number;
  category?: string;
  unit?: string;
  isActive?: boolean;
}

export interface CreateMovementDto {
  type: MovementType;
  quantity: number;
  description?: string;
  reference?: string;
  productId: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  stockQuantity?: number;
  minimumStock?: number;
  category?: string;
  unit?: string;
  isActive?: boolean;
}

export interface UpdateMovementDto {
  description?: string;
  reference?: string;
}

export interface MovementsSummary {
  totalMovements: number;
  totalIn: number;
  totalOut: number;
  totalQuantityIn: number;
  totalQuantityOut: number;
  movements: Movement[];
}

export interface DashboardOverview {
  totalProducts: number;
  lowStockProducts: Product[];
  recentMovements: Movement[];
  movementsSummary: MovementsSummary;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ProductFilters {
  category?: string;
}

export interface MovementFilters {
  type?: MovementType;
  productId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
