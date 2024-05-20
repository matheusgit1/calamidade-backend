import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  Validate,
  ValidateIf
} from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { RequestStatusEntity } from '../status/entities/request-status.entity';
import { RequestHelpTypeEntity } from '../help-type/entities/request-help-type.entity';
import { User } from 'src/modules/user/entities/user.entity';

export class CreateRequestDto {
  @ApiProperty({ example: 'Título' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Descrição' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '1000' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ type: RequestStatusEntity })
  @IsOptional()
  @Validate(IsExist, ['request_status', 'id'], {
    message: 'statusNotExists',
  })
  status?: RequestStatusEntity;

  @ApiProperty({ type: RequestHelpTypeEntity })
  @IsNotEmpty()
  @Validate(IsExist, ['request_help_type', 'id'], {
    message: 'helpTypeNotExists',
  })
  helpType: RequestHelpTypeEntity;

  @ApiProperty({example: 2, type: User})
  @IsOptional()
  @Validate(IsExist, ['User', 'id'], {
    message: 'God father not found',
  })
  godFather?: User;

  @ApiProperty()
  @ValidateIf(req => (!req.financialBank && !req.financialAgency && !req.financialAccount) || req.financialPixkey)
  @IsNotEmpty()
  financialPixkey?: string;

  @ApiProperty()
  @ValidateIf(req => !req.financialPixkey || req.financialBank)
  @IsNotEmpty()
  financialBank?: string;

  @ApiProperty()
  @ValidateIf(req => !req.financialPixkey || req.financialAgency)
  @IsNotEmpty()
  financialAgency?: string;

  @ApiProperty()
  @ValidateIf(req => !req.financialPixkey || req.financialAccount)
  @IsNotEmpty()
  financialAccount?: string;
}
