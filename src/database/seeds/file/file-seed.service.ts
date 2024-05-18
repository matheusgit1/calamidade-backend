import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReceiptEntity } from "src/modules/receipt/entities/receipt.entity";
import { FileEntity } from "src/modules/file/entities/file.entity";
import { ReceiptTypeEnum } from "src/modules/receipt/enums/receipt-type.enum";
import { ReceiptType } from "src/modules/receipt/entities/receipt-type.entity";

@Injectable()
export class FileSeedService {
  constructor(
    @InjectRepository(FileEntity)
    private repository: Repository<FileEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save([{ key: "example_key", bucket: "example_bucket" }]);
    }
  }
}
