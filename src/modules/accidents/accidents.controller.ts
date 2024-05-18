import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query, DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { AccidentsService } from "./accidents.service";
import { CreateAccidentDto } from "./dto/create-accident.dto";
import { UpdateAccidentDto } from "./dto/update-accident.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleEnum } from "../user/enums/roles.enum";
import { RolesGuard } from "../user/roles/roles.guard";
import { Roles } from "../user/roles/roles.decorator";
import { AccidentEntity } from "./entities/accident.entity";
import { InfinityPaginationResultType } from "src/utils/types/infinity-pagination-result.type";
import { infinityPagination } from "src/utils/infinity-pagination";
import { NullableType } from "src/utils/types/nullable.type";

@ApiTags("Accident")
@Controller({
  path: "accident",
  version: "1",
})
@Controller("accident")
export class AccidentsController {
  constructor(private readonly accidentsService: AccidentsService) {}

  @Post()
  create(@Body() createAccidentDto: CreateAccidentDto) {
    return this.accidentsService.create(createAccidentDto);
  }

  @Get("/list")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRoleEnum.user, UserRoleEnum.admin)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InfinityPaginationResultType<AccidentEntity>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.accidentsService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRoleEnum.user)
  @HttpCode(HttpStatus.OK)
  findOne(@Param("id") id: string): Promise<NullableType<AccidentEntity>> {
    return this.accidentsService.findOne({ id: +id });
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRoleEnum.user)
  @HttpCode(HttpStatus.OK)
  update(@Param("id") id: string, @Body() updateAccidentDto: UpdateAccidentDto) {
    return this.accidentsService.update(+id, updateAccidentDto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRoleEnum.user)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: number): Promise<void> {
    return this.accidentsService.softDelete(id);
  }
}
