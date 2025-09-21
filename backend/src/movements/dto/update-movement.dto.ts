import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMovementDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string;
}
