import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEmpty, IsNotEmpty, Validate } from "class-validator";
import { User } from "src/modules/user/entities/user.entity";
import { lowerCaseTransformer } from "src/utils/transformers/lower-case.transformer";
import { IsNotExist } from "src/utils/validators/is-not-exists.validator";

export class CreateOrganizationDto {
  @ApiProperty({ example: "test1@example.com" })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ["organization"], {
    message: "emailAlreadyExists",
  })
  @IsEmail()
  email: string | null;

  @ApiProperty({ example: "38295180000125" })
  @Validate(IsNotExist, ["organization"], {
    message: "Document already exists",
  })
  @IsNotEmpty()
  document: string | null;

  @IsNotEmpty()
  name: string | null;

  @IsNotEmpty()
  manager: User;
}
