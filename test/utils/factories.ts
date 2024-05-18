import { AccidentEntity } from "../../src/modules/accidents/entities/accident.entity";
import { FileEntity } from "../../src/modules/file/entities/file.entity";
import { OrganizationEntity } from "../../src/modules/organization/entities/organization.entity";
import { RequestEntity } from "../../src/modules/request/entities/request.entity";
import { RequestStatusEnum } from "../../src/modules/request/enums/status.enum";
import { RequestHelpTypeEntity } from "../../src/modules/request/help-type/entities/request-help-type.entity";
import { RequestStatusEntity } from "../../src/modules/request/status/entities/request-status.entity";
import { User } from "../../src/modules/user/entities/user.entity";

export function FactoryOrganization(): Partial<OrganizationEntity> {
  return {
    name: "Morgan",
    email: `fakeemail2${Date.now()}@gmail.com`,
    document: "12345678901",
  };
}

export function FactoryFile(): Partial<FileEntity> {
  return {
    key: "string",
    bucket: "string",
  };
}

export function FactoryRequest(): Partial<RequestEntity> {
  return {
    title: 'Sample Request',
    description: 'This is a sample request description.',
    amount: 100.00,
    status: new RequestStatusEntity(),
    statusId: RequestStatusEnum.analysis,
    helpType: new RequestHelpTypeEntity(),
    chavePix: 'sample-key',
    banco: 'Sample Bank',
    agencia: '1234',
    conta: '567890',
    user: new User(),
    godFather: null,
    createdAt: new Date(),
  };
}


export function FactoryAccident(): Partial<AccidentEntity> {
  return {
    request: FactoryRequest() as RequestEntity,
    file: FactoryFile() as FileEntity,
  };
}
