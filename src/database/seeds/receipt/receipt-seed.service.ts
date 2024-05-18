import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReceiptEntity, ReceiptTypeEnum } from "src/modules/receipt/entities/receipt.entity";
import { FileEntity } from "src/modules/file/entities/file.entity";

@Injectable()
export class ReceiptSeedService {
  constructor(
    @InjectRepository(ReceiptEntity)
    private repository: Repository<ReceiptEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      const file = new FileEntity();
      file.key = "example_key";
      file.bucket = "example_bucket";

      await this.repository.save([
        {
          file,
          provenValue: 500,
          receiptType: ReceiptTypeEnum.OUTRO,
          createdAt: new Date("2024-05-18T12:00:00Z"),
          updatedAt: new Date("2024-05-18T13:30:00Z"),
          deletedAt: new Date("2024-05-19T09:45:00Z"),
        },
      ]);
    }
  }
}
