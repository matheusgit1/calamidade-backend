import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CooperatedService } from './cooperated.service';
import { CreateCooperatedDto } from './dto/create-cooperated.dto';
import { UpdateCooperatedDto } from './dto/update-cooperated.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/roles/roles.guard';
import { UserRoleEnum } from '../user/enums/roles.enum';
import { Roles } from '../user/roles/roles.decorator';
import { InfinityPaginationResultType } from '../../utils/types/infinity-pagination-result.type';
import { Cooperated } from './entities/cooperated.entity';
import { infinityPagination } from '../../utils/infinity-pagination';
import { NullableType } from '../../utils/types/nullable.type';

@ApiBearerAuth()
@Roles(UserRoleEnum.user, UserRoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Cooperated')
@Controller({
  path: 'cooperated',
  version: '1',
})
export class CooperatedController {
  constructor(private readonly cooperatedService: CooperatedService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCooperatedDto: CreateCooperatedDto) {
    return this.cooperatedService.create(createCooperatedDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/list')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InfinityPaginationResultType<Cooperated>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.cooperatedService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<Cooperated>> {
    return this.cooperatedService.findOne({ id: +id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateCooperatedDto: UpdateCooperatedDto,
  ) {
    return this.cooperatedService.update(+id, updateCooperatedDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.cooperatedService.softDelete(id);
  }
}
