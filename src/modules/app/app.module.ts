import { Module } from '@nestjs/common';
import databaseConfig from '../../config/database.config';
import authConfig from '../../config/auth.config';
import appConfig from '../../config/app.config';
import mailConfig from '../../config/mail.config';
import fileConfig from '../../config/file.config';
import facebookConfig from '../../config/facebook.config';
import googleConfig from '../../config/google.config';
import twitterConfig from '../../config/twitter.config';
import appleConfig from '../../config/apple.config';
import path from 'path';

import { UsersModule } from '../user/users.module';
import { FilesModule } from '../files/files.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthAppleModule } from '../auth/social/apple/auth-apple.module';
import { AuthFacebookModule } from '../auth/social/facebook/auth-facebook.module';
import { AuthGoogleModule } from '../auth/social/google/auth-google.module';
import { AuthTwitterModule } from '../auth/social/twitter/auth-twitter.module';
import { TypeOrmConfigService } from '../../database/typeorm-config.service';
import { ForgotModule } from '../forgot/forgot.module';
import { MailModule } from '../../mail/mail.module';
import { HomeModule } from '../home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from '../../config/config.type';
import { SessionModule } from '../session/session.module';
import { MailerModule } from '../../mailer/mailer.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '../../infrastructure/interceptors/logging.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
        twitterConfig,
        appleConfig,
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    UsersModule,
    FilesModule,
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    /**
     * In a future scenario where it is interesting to use request tracing via xRay in AWS, simply enable this logging
     */
    /**
     * { provide: APP_INTERCEPTOR, useClass: XRayInterceptor }
     */
  ],
})
export class AppModule {}
