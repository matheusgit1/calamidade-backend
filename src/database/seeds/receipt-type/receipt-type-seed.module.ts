import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptTypeSeedService } from './receipt-type-seed.service';
import { ReceiptType } from 'src/modules/receipt/entities/receipt-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReceiptType])],
  providers: [ReceiptTypeSeedService],
  exports: [ReceiptTypeSeedService],
})
export class ReceiptTypeSeedModule {}
