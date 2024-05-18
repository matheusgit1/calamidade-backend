import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NullableType } from '../../utils/types/nullable.type';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AddressService {

  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createAddressDto: CreateAddressDto) {
    const user = await this.userRepository.findOne({where: {id: createAddressDto.userId}})

    if(!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'userNotFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.addressRepository.save(
      this.addressRepository.create({
        ...createAddressDto,
        user
      }),
    );
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(fields: EntityCondition<Address>): Promise<NullableType<Address>> {
    return this.addressRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    this.addressRepository.delete({id})
  }
}
