import { Module } from '@nestjs/common';
import { AnalysisService } from './request-analysis.service';
import { AnalysisController } from './request-analysis.controller';

@Module({
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}
