import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType } from 'src/config/config.type';
import { URL } from 'url';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseUrl = this.configService.get<string>('database.url', { infer: true });
    if (!databaseUrl) {
      throw new Error('Database URL is not defined');
    }

    const dbUrl = new URL(databaseUrl);
    const routingId = dbUrl.searchParams.get("options");
    dbUrl.searchParams.delete("options");

    return {
      type: this.configService.get<'cockroachdb'>('database.type', { infer: true }),
      url: dbUrl.toString(),
      host: this.configService.get('database.host', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      username: this.configService.get('database.username', { infer: true }),
      password: this.configService.get('database.password', { infer: true }),
      database: this.configService.get('database.name', { infer: true }),
      synchronize: this.configService.get('database.synchronize', {
        infer: true,
      }),
      dropSchema: false,
      keepConnectionAlive: true,
      logging:
        this.configService.get('app.nodeEnv', { infer: true }) !== 'production',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.get<number>('database.maxConnections', { infer: true }),
        ssl: this.configService.get('database.sslEnabled', { infer: true }),
        options: routingId || undefined
      },
    } as TypeOrmModuleOptions;
  }
}
