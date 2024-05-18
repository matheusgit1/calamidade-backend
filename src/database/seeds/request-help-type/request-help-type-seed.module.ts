import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestHelpTypeSeedService } from './request-help-type-seed.service';
import { RequestHelpType } from 'src/modules/request/entities/request-help-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestHelpType])],
  providers: [RequestHelpTypeSeedService],
  exports: [RequestHelpTypeSeedService],
})
export class RequestHelpTypeSeedModule {}
