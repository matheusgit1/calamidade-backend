import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReceiptType } from 'src/modules/receipt/entities/receipt-type.entity';
import { ReceiptTypeEnum } from 'src/modules/receipt/enums/receipt-type.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ReceiptTypeSeedService {
  constructor(
    @InjectRepository(ReceiptType)
    private repository: Repository<ReceiptType>,
  ) {}

  async run() {
    console.log('Initializing receipt type Seed');

    try {
      const count = await this.repository.count();
      console.log('ReceiptTypeSeedService - count:', count);

      if (count === 0) {
        
        const invoice = this.repository.create({
          id: ReceiptTypeEnum.INVOICE,
          name: 'Recibo',
        });
        
        const receipt = this.repository.create({
          id: ReceiptTypeEnum.RECEIPT,
          name: 'Comprovante',
        });

        const other = this.repository.create({
          id: ReceiptTypeEnum.OTHER,
          name: 'Outro',
        });

        await this.repository.save([invoice, receipt, other]);
        console.log('receipt types created:', [invoice, receipt, other]);
      } else {
        console.log('receipt types already exist. Skipping creation.');
      }
    } catch (error) {
      console.error('Error during receipt type seeding:', error);
    }

    console.log('Finished receipt type Seed');
  }
}
