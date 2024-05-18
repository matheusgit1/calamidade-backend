import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Request,
} from "@nestjs/common";
import { RequestService } from "./request.service";
import { CreateRequestDto } from "./dto/create-request.dto";
import { UpdateRequestDto } from "./dto/update-request.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRoleEnum } from "../user/enums/roles.enum";
import { Roles } from "../user/roles/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../user/roles/roles.guard";
import { infinityPagination } from "src/utils/infinity-pagination";
import { NullableType } from "src/utils/types/nullable.type";
import { RequestEntity } from "./entities/request.entity";

@ApiBearerAuth()
@Roles(UserRoleEnum.user)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiTags("Requests")
@Controller({
  path: "requests",
  version: "1",
})
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() request, @Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(request.user, createRequestDto);
  }

  @Get()
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("ordering", new DefaultValuePipe("ASC")) ordering: "ASC" | "DESC",
  ) {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.requestService.findManyWithPagination({
        page,
        limit,
        ordering,
      }),
      { page, limit, ordering },
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<NullableType<RequestEntity>> {
    return this.requestService.findOne({ id: +id });
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(+id, updateRequestDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.requestService.remove(+id);
  }
}
