import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateMovementDto } from './create-movement.dto';

export class UpdateMovementDto extends PartialType(
  OmitType(CreateMovementDto, ['type', 'quantity', 'productId'] as const),
) {}
