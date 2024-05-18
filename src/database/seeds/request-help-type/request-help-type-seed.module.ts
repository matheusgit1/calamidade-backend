import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestHelpTypeSeedService } from './request-help-type-seed.service';
import { RequestHelpTypeEntity } from 'src/modules/request/help-type/entities/request-help-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestHelpTypeEntity])],
  providers: [RequestHelpTypeSeedService],
  exports: [RequestHelpTypeSeedService],
})
export class RequestHelpTypeSeedModule {}
