import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/modules/file/entities/file.entity';
import { ReceiptEntity } from 'src/modules/receipt/entities/receipt.entity';
import { ReceiptSeedService } from './receipt-seed.service';


@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, ReceiptEntity])],
  providers: [ReceiptSeedService],
  exports: [ReceiptSeedService],
})
export class ReceiptSeedModule {}
