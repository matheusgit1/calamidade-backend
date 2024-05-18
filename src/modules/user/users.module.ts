import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { OrganizationEntity } from '../organization/entities/organization.entity';
import { Cooperated } from '../cooperated/entities/cooperated.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OrganizationEntity, Cooperated])],
  controllers: [UsersController],
  providers: [IsExist, IsNotExist, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
