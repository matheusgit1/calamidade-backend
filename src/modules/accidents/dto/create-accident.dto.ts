import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { FileEntity } from "src/modules/file/entities/file.entity";
import { RequestEntity } from "src/modules/request/entities/request.entity";
import { IsNotExist } from "src/utils/validators/is-not-exists.validator";

export class CreateAccidentDto {
  @ApiProperty({
    description: 'ID of the associated request',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  request: RequestEntity;

  @ApiProperty({
    description: 'ID of the associated file',
    example: '51cd8d8d-68e4-4532-a2eb-939456ce1834'
  })
  @IsNotEmpty()
  @IsString()
  file: FileEntity;
}
