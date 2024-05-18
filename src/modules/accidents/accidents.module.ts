import { Module } from '@nestjs/common';
import { AccidentsService } from './accidents.service';
import { AccidentsController } from './accidents.controller';

@Module({
  controllers: [AccidentsController],
  providers: [AccidentsService],
})
export class AccidentsModule {}
