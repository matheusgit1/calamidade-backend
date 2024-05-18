import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query, DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { ReceiptService } from "./receipt.service";
import { CreateReceiptDto } from "./dto/create-receipt.dto";
import { UpdateReceiptDto } from "./dto/update-receipt.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRoleEnum } from "../user/enums/roles.enum";
import { Roles } from "../user/roles/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../user/roles/roles.guard";
import { InfinityPaginationResultType } from "src/utils/types/infinity-pagination-result.type";
import { infinityPagination } from "src/utils/infinity-pagination";
import { ReceiptEntity } from "./entities/receipt.entity";
import { NullableType } from "src/utils/types/nullable.type";

@ApiBearerAuth()
@Roles(UserRoleEnum.user, UserRoleEnum.user)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiTags("Receipt")
@Controller({ path: "receipt", version: "1" })
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRoleEnum.admin)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateReceiptDto) {
    return this.receiptService.create(dto);
  }

  @Get("/list")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRoleEnum.user)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InfinityPaginationResultType<ReceiptEntity>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.receiptService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRoleEnum.user)
  @HttpCode(HttpStatus.OK)
  findOne(@Param("id") id: string): Promise<NullableType<ReceiptEntity>> {
    return this.receiptService.findOne({ id: +id });
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRoleEnum.user)
  @HttpCode(HttpStatus.OK)
  update(@Param("id") id: string, @Body() dto: UpdateReceiptDto) {
    return this.receiptService.update(+id, dto);
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(UserRoleEnum.user)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: number): Promise<void> {
    return this.receiptService.softDelete(id);
  }
}
