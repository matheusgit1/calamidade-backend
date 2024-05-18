import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestStatusSeedService } from './request-status-seed.service';
import { RequestStatus } from 'src/modules/request/entities/request-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestStatus])],
  providers: [RequestStatusSeedService],
  exports: [RequestStatusSeedService],
})
export class RequestStatusSeedModule {}
