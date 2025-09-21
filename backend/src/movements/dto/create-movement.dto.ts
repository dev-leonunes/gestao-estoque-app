import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { MovementType } from '../entities/movement.entity';

export class CreateMovementDto {
  @IsNotEmpty()
  @IsEnum(MovementType, { message: 'Tipo deve ser IN ou OUT' })
  type: MovementType;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @IsPositive({ message: 'Quantidade deve ser positiva' })
  @Transform(({ value }) => parseInt(value))
  quantity: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string;

  @IsNotEmpty()
  @IsUUID(4, { message: 'ID do produto deve ser um UUID válido' })
  productId: string;
}
