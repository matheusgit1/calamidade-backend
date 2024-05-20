import { CooperatedEntity } from '../cooperated/entities/cooperated.entity';
import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestEntity } from './entities/request.entity';
import { RequestService } from './request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UsersModule } from '../user/users.module';
import { AnalysisModule } from './analysis/request-analysis.module';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity, User, CooperatedEntity]), UsersModule],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
