import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  Validate,
  ValidateIf
} from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { RequestStatus } from '../entities/request-status.entity';
import { RequestHelpType } from '../entities/request-help-type.entity';
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

  @ApiProperty({ type: RequestStatus })
  @IsOptional()
  @Validate(IsExist, ['RequestStatus', 'id'], {
    message: 'statusNotExists',
  })
  status?: RequestStatus;

  @ApiProperty({ type: RequestHelpType })
  @IsNotEmpty()
  @Validate(IsExist, ['RequestHelpType', 'id'], {
    message: 'helpTypeNotExists',
  })
  helpType: RequestHelpType;

  @ApiProperty({example: 1, type: User})
  @IsNotEmpty()
  // É possível passar um id ao inves de um objeto, e usar o IsExist?
  // @Validate(IsExist, ['User', 'id'], {
  //   message: 'User not found',
  // })
  userId: number;

  @ApiProperty({example: 2, type: User})
  @IsOptional()
  // @Validate(IsExist, ['User', 'id'], {
  //   message: 'God father not found',
  // })
  godFatherId?: number;

  @ApiProperty()
  @ValidateIf(o => (!o.banco && !o.agencia && !o.conta) || o.chavePix)
  @IsNotEmpty()
  chavePix?: string;

  @ApiProperty()
  @ValidateIf(o => !o.chavePix || o.banco)
  @IsNotEmpty()
  banco?: string;

  @ApiProperty()
  @ValidateIf(o => !o.chavePix || o.agencia)
  @IsNotEmpty()
  agencia?: string;

  @ApiProperty()
  @ValidateIf(o => !o.chavePix || o.conta)
  @IsNotEmpty()
  conta?: string;
}
