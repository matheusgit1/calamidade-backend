import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class UpdateRequestDto {
  @ApiProperty({ example: 'Título' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Descrição' })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ example: '1000' })
  @IsOptional()
  @IsNotEmpty()
  amount?: number;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  financialPixkey?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  financialBank?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  financialAgency?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  financialAccount?: string;
}
