import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationEntity } from 'src/modules/organization/entities/organization.entity';
import { OrganizationSeedService } from './organization-seed.service';
import { User } from 'src/modules/user/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([OrganizationEntity, User])],
  providers: [OrganizationSeedService],
  exports: [OrganizationSeedService],
})
export class OrganizationSeedModule {}
