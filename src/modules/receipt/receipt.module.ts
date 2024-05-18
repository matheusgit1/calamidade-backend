import { Module } from "@nestjs/common";
import { ReceiptService } from "./receipt.service";
import { ReceiptController } from "./receipt.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { IsNotExist } from "src/utils/validators/is-not-exists.validator";
import { ReceiptEntity } from "./entities/receipt.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ReceiptEntity])],
  controllers: [ReceiptController],
  providers: [IsExist, IsNotExist, ReceiptService],
})
export class ReceiptModule {}
