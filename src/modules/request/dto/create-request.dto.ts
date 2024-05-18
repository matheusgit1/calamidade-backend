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
  @Validate(IsExist, ['RequestStatus', 'id'], {
    message: 'statusNotExists',
  })
  status?: RequestStatusEntity;

  @ApiProperty({ type: RequestHelpTypeEntity })
  @IsNotEmpty()
  @Validate(IsExist, ['RequestHelpType', 'id'], {
    message: 'helpTypeNotExists',
  })
  helpType: RequestHelpTypeEntity;

  @ApiProperty({example: 1, type: User})
  @IsNotEmpty()
  @Validate(IsExist, ['User', 'id'], {
    message: 'User not found',
  })
  user: User;

  @ApiProperty({example: 2, type: User})
  @IsOptional()
  @Validate(IsExist, ['User', 'id'], {
    message: 'God father not found',
  })
  godFather?: User;

  @ApiProperty()
  @ValidateIf(req => (!req.banco && !req.agencia && !req.conta) || req.chavePix)
  @IsNotEmpty()
  chavePix?: string;

  @ApiProperty()
  @ValidateIf(req => !req.chavePix || req.banco)
  @IsNotEmpty()
  banco?: string;

  @ApiProperty()
  @ValidateIf(req => !req.chavePix || req.agencia)
  @IsNotEmpty()
  agencia?: string;

  @ApiProperty()
  @ValidateIf(req => !req.chavePix || req.conta)
  @IsNotEmpty()
  conta?: string;
}
