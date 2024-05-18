import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import * as dotenv from "dotenv";
import { MailData } from "src/mail/interfaces/mail-data.interface";
import { User } from "../user/entities/user.entity";
import { DeepPartial } from "typeorm";
import { NullableType } from "src/utils/types/nullable.type";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { Forgot } from "../forgot/entities/forgot.entity";
import { FindOptions } from "src/utils/types/find-options.type";
import { Session } from "../session/entities/session.entity";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "src/config/config.type";
import { UserStatus } from "../user/entities/user-status.entity";
import { UserRole } from "../user/entities/user-role.entity";
import { CooperatedEntity } from "../cooperated/entities/cooperated.entity";
import { OrganizationEntity } from "../organization/entities/organization.entity";

dotenv.config();

const user = new User();
const org = new OrganizationEntity();
const userStatus = new UserStatus();
const userRole = new UserRole();
const cooperated = new CooperatedEntity();
const session = new Session();
const forgot = new Forgot();

cooperated.firstName = "barack";
cooperated.id = 1;
cooperated.email = "barack.obama@example.com";
cooperated.lastName = "obama";
cooperated.phone = "27997000065";
cooperated.document = "51260605035";
cooperated.createdAt = new Date();
cooperated.updatedAt = new Date();
cooperated.deletedAt = new Date();

userRole.id = 1;
userRole.name = "admin";

userStatus.id = 1;
userStatus.name = "Active";

user.id = 1;
user.email = "test@example.com";
user.password = "$2a$10$yJyGsexHRWW37yGtCFMSR.Y4kL7QcX8Eyl7Kam8E1L3fkxvFrHhE2";
user.previousPassword = "previousPassword";
user.provider = "email";
user.socialId = "socialId";
user.firstName = "lindissei";
user.lastName = "lorran";
user.photo = null;
user.role = userRole;
user.status = userStatus;
user.hash = "hash";
user.createdAt = new Date();
user.updatedAt = new Date();
user.deletedAt = new Date();

session.id = 1;
session.user = user;
session.createdAt = new Date();
session.deletedAt = new Date();

forgot.createdAt = new Date();
forgot.deletedAt = new Date();
forgot.id = 1;
forgot.hash = "hash";
forgot.user = user;


class MailServiceMocked {
  userSignUp = jest.fn(async (_mailData: MailData<{ hash: string }>): Promise<void> => {});
  forgotPassword = jest.fn(async (mailData: MailData<{ hash: string }>): Promise<void> => {});
}

interface Identifiable {
  id: number | string;
}

class ServiceMocked<T extends Identifiable> {
  private readonly entity: T;

  constructor(mockEntity: T) {
    this.entity = mockEntity;
  }

  create = jest.fn(async (_createProfileDto: CreateUserDto): Promise<T> => {
    return this.entity;
  });

  findManyWithPagination = jest.fn(async (_paginationOptions: IPaginationOptions): Promise<T[]> => {
    return [this.entity];
  });

  findMany = jest.fn(async (_options: FindOptions<T>): Promise<T[]> => {
    return [this.entity];
  });

  findOne = jest.fn(async (_fields: EntityCondition<T>): Promise<NullableType<T>> => {
    return this.entity;
  });

  update = jest.fn(async (_id: T["id"], _payload: DeepPartial<T>): Promise<T> => {
    return this.entity;
  });

  softDelete = jest.fn(async (_id: T["id"]): Promise<void> => {});
}

const jwtService = new JwtService();
const organizationServiceMocked = new ServiceMocked<OrganizationEntity>(org);
const usersServiceMocked = new ServiceMocked<User>(user);
const forgotServiceMocked = new ServiceMocked<Forgot>(forgot);
const sessionServiceMocked = new ServiceMocked<Session>(session);
const mailServiceMocked = new MailServiceMocked();
const configService = new ConfigService<AllConfigType>();

describe("TestingController", () => {
  let controller: AuthController = new AuthController(
    new AuthService(
      jwtService,
      //@ts-ignore
      usersServiceMocked,
      organizationServiceMocked,
      forgotServiceMocked,
      sessionServiceMocked,
      mailServiceMocked,
      configService,
    ),
  );
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("success cases", () => {
    it("should execute soft delete without erro", async () => {
      const spy_usersServiceMocked_softDelete = jest.spyOn(usersServiceMocked, "softDelete");
      const response = await controller.delete({ user: user.toJSON() });
      expect(spy_usersServiceMocked_softDelete).toHaveBeenCalledTimes(1);
      expect(spy_usersServiceMocked_softDelete).toHaveBeenCalledWith(user.id);

      expect(response).toBeUndefined();
    });

    it("should execute update without erro (without password)", async () => {
      const spy_usersServiceMocked_update = jest.spyOn(usersServiceMocked, "update");
      const spy_usersServiceMocked_findOne = jest.spyOn(usersServiceMocked, "findOne");
      const spy_sessionServiceMocked_softDelete = jest.spyOn(sessionServiceMocked, "softDelete");

      const userUpdate = {
        firstName: "firstName",
        lastName: "lastName",
        oldPassword: user.password,
      };

      const response = await controller.update({ user: user.toJSON() }, userUpdate);

      expect(spy_usersServiceMocked_update).toHaveBeenCalledTimes(1);
      expect(spy_usersServiceMocked_findOne).toHaveBeenCalledTimes(1);
      expect(spy_sessionServiceMocked_softDelete).toHaveBeenCalledTimes(0);
      expect(spy_usersServiceMocked_update).toHaveBeenCalledWith(user.id, userUpdate);

      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(User);
    });

    it("should execute update without erro (with the same old password)", async () => {
      usersServiceMocked.findOne.mockResolvedValueOnce(user);

      const spy_usersServiceMocked_update = jest.spyOn(usersServiceMocked, "update");
      const spy_usersServiceMocked_findOne = jest.spyOn(usersServiceMocked, "findOne");
      const spy_sessionServiceMocked_softDelete = jest.spyOn(sessionServiceMocked, "softDelete");
      const userUpdate = {
        firstName: "firstName",
        lastName: "lastName",
        oldPassword: "password123",
        password: "password123",
      };

      user.password = "$2a$10$yJyGsexHRWW37yGtCFMSR.Y4kL7QcX8Eyl7Kam8E1L3fkxvFrHhE2";

      const response = await controller.update({ user: user }, userUpdate);
      expect(spy_usersServiceMocked_update).toHaveBeenCalledTimes(1);
      expect(spy_usersServiceMocked_findOne).toHaveBeenCalledTimes(2);
      expect(spy_sessionServiceMocked_softDelete).toHaveBeenCalledTimes(1);
      expect(spy_usersServiceMocked_update).toHaveBeenCalledWith(user.id, userUpdate);

      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(User);
    });

    it("should execute logout without erro", async () => {
      const spy_sessionServiceMocked_softDelete = jest.spyOn(sessionServiceMocked, "softDelete");

      const response = await controller.logout({ user: { sessionId: session.id } });
      expect(spy_sessionServiceMocked_softDelete).toHaveBeenCalledTimes(1);
      expect(spy_sessionServiceMocked_softDelete).toHaveBeenCalledWith({ id: session.id });

      expect(response).toBeUndefined();
    });

    it("should execute me correctly", async () => {
      sessionServiceMocked.findOne.mockResolvedValueOnce(session);
      const response = await controller.me({ user: user });
      expect(response).toBeDefined();
    });

    it("should execute forgotPassword correctly", async () => {
      usersServiceMocked.findOne.mockResolvedValueOnce(user);
      forgotServiceMocked.create.mockResolvedValueOnce(forgot);

      const spy_usersServiceMocked_findOne = jest.spyOn(usersServiceMocked, "findOne");
      const spy_forgotServiceMocked_create = jest.spyOn(forgotServiceMocked, "create");
      const spy_mailServiceMocked_forgotPassword = jest.spyOn(mailServiceMocked, "forgotPassword");

      const input = { email: "test@example.com" };
      const response = await controller.forgotPassword(input);

      expect(response).toBeUndefined();
      expect(spy_usersServiceMocked_findOne).toHaveBeenCalledTimes(1);
      expect(spy_usersServiceMocked_findOne).toHaveBeenCalledWith({ email: input.email });

      expect(spy_forgotServiceMocked_create).toHaveBeenCalledTimes(1);
      expect(spy_mailServiceMocked_forgotPassword).toHaveBeenCalledTimes(1);
    });

    // it("should execute confirmEmail correctly", async () => {
    //   //Revalidate
    // })

    // it("should execute confirmEmail correctly", async () => {
    //   //register
    // })
  });
});

