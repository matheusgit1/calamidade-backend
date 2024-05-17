import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/config/app.config';
import databaseConfig from 'src/config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { RoleSeedModule } from './user-role/role-seed.module';
import { StatusSeedModule } from './user-status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';
import { OrganizationSeedModule } from './organization/organization-seed.module';
import { CooperatedSeedModule } from './cooperated/cooperated-seed.module';


@Module({
  imports: [
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
    CooperatedSeedModule,
    OrganizationSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: [".env"],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
