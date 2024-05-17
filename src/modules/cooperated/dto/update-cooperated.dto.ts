import { PartialType } from '@nestjs/swagger';
import { CreateCooperatedDto } from './create-cooperated.dto';

export class UpdateCooperatedDto extends PartialType(CreateCooperatedDto) {}
