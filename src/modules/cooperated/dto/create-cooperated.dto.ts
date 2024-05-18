import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, Validate } from "class-validator";
import { IsNotExist } from "../../../utils/validators/is-not-exists.validator";
import { lowerCaseTransformer } from "../../../utils/transformers/lower-case.transformer";
import { IsValidCpfOrCnpj } from "../../../utils/validators/is-document.validator";
import { OrganizationEntity } from "src/modules/organization/entities/organization.entity";
import { NumericOnlyTransform } from "src/infrastructure/custom-transforms";

export class CreateCooperatedDto {
  @ApiProperty({ example: "test1@example.com" })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ["cooperated"], {
    message: "Email already exists",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Morgan" })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Stark" })
  @IsNotEmpty()
  lastName: string | null;

  @ApiProperty({ example: "+5511995039284" })
  @IsNotEmpty()
  @IsPhoneNumber("BR")
  @NumericOnlyTransform()
  phone: string;

  @ApiProperty({ example: "44444444444" })
  @IsNotEmpty()
  @IsValidCpfOrCnpj()
  @NumericOnlyTransform()
  @Validate(IsNotExist, ["cooperated"], {
    message: "Document already exists",
  })
  document: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  organization: OrganizationEntity;
}
