import { HttpException, HttpStatus, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { CreateRequestDto } from "./dto/create-request.dto";
import { UpdateRequestDto } from "./dto/update-request.dto";
import { Repository } from "typeorm";
import { RequestEntity } from "./entities/request.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { User } from "../user/entities/user.entity";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { NullableType } from "src/utils/types/nullable.type";
import { JwtPayloadType } from "../auth/strategies/types/jwt-payload.type";

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(RequestEntity)
    private requestRepository: Repository<RequestEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userJwtPayload: JwtPayloadType, createRequestDto: CreateRequestDto) {
    const currentUser = await this.userRepository.findOne({
      where: {
        id: userJwtPayload.id,
      },
    });

    if (!currentUser) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: "userNotFound",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.requestRepository.save(
      this.requestRepository.create({
        ...createRequestDto,
        user: {
          id: currentUser.id,
        },
      }),
    );
  }

  findManyWithPagination(paginationOptions: IPaginationOptions): Promise<RequestEntity[]> {
    return this.requestRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<RequestEntity>): Promise<NullableType<RequestEntity>> {
    return this.requestRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return this.requestRepository.save(
      this.requestRepository.create({
        id,
        ...updateRequestDto,
      }),
    );
  }

  async remove(id: number): Promise<void> {
    this.requestRepository.softDelete(id);
  }
}
