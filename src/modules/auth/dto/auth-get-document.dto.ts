import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class GetDocumentBodyDto {
  @ApiProperty({
    example: "99999999999",
  })
  @MinLength(11)
  @IsString()
  document: string;
}
