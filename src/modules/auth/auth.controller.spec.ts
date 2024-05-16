import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "../user/users.module";
import { ForgotModule } from "../forgot/forgot.module";
import { SessionModule } from "../session/session.module";
import { PassportModule, PassportStrategy } from "@nestjs/passport";
import { MailModule } from "src/mail/mail.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { IsExist } from "src/utils/validators/is-exists.validator";
import { IsNotExist } from "src/utils/validators/is-not-exists.validator";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { AnonymousStrategy } from "./strategies/anonymous.strategy";
import { MailerService } from "src/mailer/mailer.service";
import { ValidationArguments, ValidatorConstraintInterface } from "class-validator";
import { Strategy } from "passport-jwt";
import { OrNeverType } from "src/utils/types/or-never.type";
import { JwtPayloadType } from "./strategies/types/jwt-payload.type";
import { DynamicModule, Module } from "@nestjs/common";
import { JwtRefreshPayloadType } from "./strategies/types/jwt-refresh-payload.type";
import * as dotenv from "dotenv";
import { MailData } from "src/mail/interfaces/mail-data.interface";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { UsersController } from "../user/users.controller";
import { UsersService } from "../user/users.service";
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

dotenv.config();

const user = new User();
const userStatus = new UserStatus();
const userRole = new UserRole();

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
user.firstName = "firstName";
user.lastName = "lastName";
user.photo = null;
user.role = userRole;
user.status = userStatus;
user.hash = "hash";
user.createdAt = new Date();
user.updatedAt = new Date();
user.deletedAt = new Date();

class IsExistMocked implements ValidatorConstraintInterface {
  validate = jest.fn(async (_value: string, _validationArguments: ValidationArguments): Promise<boolean> => false);
}

export class IsNotExistMocked implements ValidatorConstraintInterface {
  validate = jest.fn(async (_value: string, _validationArguments: ValidationArguments): Promise<boolean> => false);
}

export class JwtStrategyMocked {
  validate = jest.fn((_payload: JwtPayloadType): OrNeverType<JwtPayloadType> => {
    return { id: 1, sessionId: 1, iat: 1, exp: 1 };
  });
}

export class JwtRefreshStrategyMocked {
  validate = jest.fn((_payload: JwtRefreshPayloadType): OrNeverType<JwtRefreshPayloadType> => {
    return { sessionId: 1, iat: 1, exp: 1 };
  });
}

export class AnonymousStrategyMocked {
  validate = jest.fn((_payload: unknown, _request: unknown): unknown => {
    return jest.fn();
  });
}

export class MailServiceMocked {
  userSignUp = jest.fn(async (_mailData: MailData<{ hash: string }>): Promise<void> => {});
  forgotPassword = jest.fn(async (mailData: MailData<{ hash: string }>): Promise<void> => {});
}

export class UsersServiceMocked {
  create = jest.fn(async (_createProfileDto: CreateUserDto): Promise<User> => {
    return user;
  });

  findManyWithPagination = jest.fn(async (_paginationOptions: IPaginationOptions): Promise<User[]> => {
    return [user];
  });
  findOne = jest.fn(async (_fields: EntityCondition<User>): Promise<NullableType<User>> => {
    return user;
  });

  update = jest.fn(async (_id: User["id"], _payload: DeepPartial<User>): Promise<User> => {
    return user;
  });

  softDelete = jest.fn(async (_id: User["id"]): Promise<void> => {});
}

export class ForgotServiceMocked {
  findOne = jest.fn(async (_options: FindOptions<Forgot>): Promise<NullableType<Forgot>> => {
    return new Forgot();
  });

  findMany = jest.fn(async (_options: FindOptions<Forgot>): Promise<Forgot[]> => {
    return [new Forgot()];
  });

  create = jest.fn(async (_data: DeepPartial<Forgot>): Promise<Forgot> => {
    return new Forgot();
  });

  softDelete = jest.fn(async (_id: Forgot["id"]): Promise<void> => {});
}

export class SessionServiceMocked {
  findOne = jest.fn(async (_options: FindOptions<Session>): Promise<NullableType<Session>> => {
    return new Session();
  });

  findMany = jest.fn(async (_options: FindOptions<Session>): Promise<Session[]> => {
    return [new Session()];
  });

  create = jest.fn(async (_data: DeepPartial<Session>): Promise<Session> => {
    return new Session();
  });
}

const jwtService = new JwtService();
const usersServiceMocked = new UsersServiceMocked();
const forgotServiceMocked = new ForgotServiceMocked();
const sessionServiceMocked = new SessionServiceMocked();
const mailServiceMocked = new MailServiceMocked();
const configService = new ConfigService<AllConfigType>();

let controller: AuthController = new AuthController(
  new AuthService(jwtService, usersServiceMocked as any, forgotServiceMocked as any, sessionServiceMocked as any, mailServiceMocked as any, configService),
);
describe("TestingController", () => {
  beforeEach(async () => {});

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("success cases", () => {
    it("should do login correctly", async () => {
      user.role = undefined;
      user.provider = "email";
      usersServiceMocked.findOne.mockResolvedValueOnce(user);
      const res = await controller.login({
        email: "test@example.com",
        password: "password123",
      });
      console.log(res);

      expect(res).toBeDefined();
    });
  });
});
