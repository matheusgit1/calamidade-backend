import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, Validate } from "class-validator";
import { FileEntity } from "src/modules/file/entities/file.entity";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { ReceiptTypeEnum } from "../enums/receipt-type.enum";
import { ReceiptType } from "../entities/receipt-type.entity";

export class CreateReceiptDto {
  @ApiProperty({ example: 2, type: FileEntity, description: "A chave do arquivo associado." })
  @IsNotEmpty()
  @Validate(IsExist, ["file", "id"], {
    message: "Arquivo não encontrado",
  })
  file?: FileEntity;

  @ApiProperty({ type: ReceiptType, description: "O tipo de recibo. (Nota Fiscal(0), Comprovante(1), Outro(3))", default: ReceiptTypeEnum.OTHER })
  @Validate(IsExist, ["ReceiptType", "id"], {
    message: "ReceiptNotExists",
  })
  receiptType?: ReceiptType;

  @ApiProperty({ example: "2024-05-18T12:00:00Z", description: "A data e hora em que o recibo foi criado." })
  createdAt: Date;

  @ApiProperty({ example: "2024-05-18T13:30:00Z", description: "A data e hora da última atualização do recibo." })
  updatedAt: Date;

  @ApiProperty({ example: "2024-05-19T09:45:00Z", description: "A data e hora em que o recibo foi excluído." })
  deletedAt: Date;
}
