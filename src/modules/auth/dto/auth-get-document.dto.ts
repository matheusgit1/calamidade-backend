import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class GetDocumentBodyDto {
  @ApiProperty({
    example: "14267215014",
  })
  @MinLength(11)
  @IsString()
  document: string;
}
