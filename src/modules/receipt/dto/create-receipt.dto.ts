import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, Validate } from "class-validator";
import { ReceiptTypeEnum } from "../entities/receipt.entity";
import { FileEntity } from "src/modules/file/entities/file.entity";
import { IsExist } from "src/utils/validators/is-exists.validator";

export class CreateReceiptDto {
  @ApiProperty({ example: 2, type: FileEntity, description: "A chave do arquivo associado." })
  @IsNotEmpty()
  @Validate(IsExist, ["file", "id"], {
    message: "Arquivo não encontrado",
  })
  file?: FileEntity;

  @ApiProperty({ enum: ReceiptTypeEnum, description: "O tipo de recibo.", default: ReceiptTypeEnum.OUTRO })
  @IsEnum(ReceiptTypeEnum)
  @IsNotEmpty()
  receiptType: ReceiptTypeEnum;

  @ApiProperty({ example: "2024-05-18T12:00:00Z", description: "A data e hora em que o recibo foi criado." })
  createdAt: Date;

  @ApiProperty({ example: "2024-05-18T13:30:00Z", description: "A data e hora da última atualização do recibo." })
  updatedAt: Date;

  @ApiProperty({ example: "2024-05-19T09:45:00Z", description: "A data e hora em que o recibo foi excluído." })
  deletedAt: Date;
}
