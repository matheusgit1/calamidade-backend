import { Module } from "@nestjs/common";
import appConfig from "../../config/app.config";
import appleConfig from "../../config/apple.config";
import authConfig from "../../config/auth.config";
import databaseConfig from "../../config/database.config";
import facebookConfig from "../../config/facebook.config";
import fileConfig from "../../config/file.config";
import googleConfig from "../../config/google.config";
import mailConfig from "../../config/mail.config";
import twitterConfig from "../../config/twitter.config";

import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";
import { TypeOrmConfigService } from "../../database/typeorm-config.service";
import { MailModule } from "../../mail/mail.module";
import { MailerModule } from "../../mailer/mailer.module";
import { AuthModule } from "../auth/auth.module";
import { AuthAppleModule } from "../auth/social/apple/auth-apple.module";
import { AuthFacebookModule } from "../auth/social/facebook/auth-facebook.module";
import { AuthGoogleModule } from "../auth/social/google/auth-google.module";
import { AuthTwitterModule } from "../auth/social/twitter/auth-twitter.module";
import { FileModule } from "../file/file.module";
import { ForgotModule } from "../forgot/forgot.module";
import { HomeModule } from "../home/home.module";
import { SessionModule } from "../session/session.module";
import { UsersModule } from "../user/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CooperatedModule } from "../cooperated/cooperated.module";
import { OrganizationModule } from "../organization/organization.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig, facebookConfig, googleConfig, twitterConfig, appleConfig],
      envFilePath: [".env"],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    UsersModule,
    FileModule,
    AuthModule,
    AuthFacebookModule,
    AuthGoogleModule,
    AuthTwitterModule,
    AuthAppleModule,
    ForgotModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
    AppModule,
    CooperatedModule,
    OrganizationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
