import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, Validate } from "class-validator";
import { FileEntity } from "src/modules/file/entities/file.entity";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { ReceiptTypeEnum } from "../enums/receipt-type.enum";
import { ReceiptType } from "../entities/receipt-type.entity";
import { RequestEntity } from "src/modules/request/entities/request.entity";

export class CreateReceiptDto {
  @ApiProperty({ example: 2, type: FileEntity, description: "A chave do arquivo associado." })
  @IsNotEmpty()
  @Validate(IsExist, ["file", "id"], {
    message: "Arquivo não encontrado",
  })
  file?: FileEntity;

  @ApiProperty({ example: 2, type: RequestEntity, description: "A requisicao do associado." })
  @IsNotEmpty()
  request: RequestEntity;

  @ApiProperty({ type: ReceiptType, description: "O tipo de recibo. (Nota Fiscal(0), Comprovante(1), Outro(3))", default: ReceiptTypeEnum.OTHER })
  @Validate(IsExist, ["ReceiptType", "id"], {
    message: "ReceiptNotExists",
  })
  receiptType?: ReceiptType;

  @ApiProperty({ example: 500.2, description: "O valor comprovado do recibo." })
  @IsNotEmpty()
  @IsNumber()
  provenValue: number;
}
