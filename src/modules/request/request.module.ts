import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestEntity } from './entities/request.entity';
import { User } from '../user/entities/user.entity';
import { AnalysisModule } from './analysis/request-analysis.module';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity, User]), AnalysisModule],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
