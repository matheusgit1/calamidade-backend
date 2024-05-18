import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Repository } from 'typeorm';
import { RequestEntity } from './entities/request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RequestService {

  constructor(
    @InjectRepository(RequestEntity)
    private requestRepository: Repository<RequestEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createRequestDto: CreateRequestDto) {
    // const user = await this.userRepository.findOne({
    //   where: {
    //     id: createRequestDto.userId
    //   }
    // });
    // if (!user) throw new NotFoundException("User was not found");

    // if (createRequestDto.godFatherId) {
    //   const godFather = await this.userRepository.findOne({
    //     where: {
    //       id: createRequestDto.godFatherId
    //     }
    //   });
    //   if (!godFather) throw new NotFoundException("God father was not found");
    // }

    return this.requestRepository.save(
      this.requestRepository.create({
        ...createRequestDto
      }),
    );
  }

  findManyWithPagination(paginationOptions: IPaginationOptions): Promise<RequestEntity[]> {
    return this.requestRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(id: number) {
    return this.requestRepository.findOne({
      where: {
        id
      },
    });
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    // return this.requestRepository.save(
    //   this.requestRepository.create({
    //     id,
    //     ...updateRequestDto,
    //   }),
    // );
  }

  async remove(id: number): Promise<void> {
    this.requestRepository.softDelete(id);
  }
}
