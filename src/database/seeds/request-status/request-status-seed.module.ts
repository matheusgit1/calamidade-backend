import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestStatusSeedService } from './request-status-seed.service';
import { RequestStatusEntity } from 'src/modules/request/status/entities/request-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestStatusEntity])],
  providers: [RequestStatusSeedService],
  exports: [RequestStatusSeedService],
})
export class RequestStatusSeedModule {}
