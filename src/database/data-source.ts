import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { URL } from 'url';


const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('Database URL is not defined');
}

const dbUrl = new URL(databaseUrl);
const routingId = dbUrl.searchParams.get("options");
dbUrl.searchParams.delete("options");

const isSSL = process.env.DATABASE_SSL_ENABLED === 'true';



const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE, // Ajuste o tipo conforme necessário
  url: dbUrl.toString(),
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  dropSchema: false,
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV !== 'production',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'subscriber',
  },
  extra: {
    max: process.env.DATABASE_MAX_CONNECTIONS ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) : 100,
    ssl: isSSL
      ? {
          rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
          ca: process.env.DATABASE_CA ?? undefined,
          key: process.env.DATABASE_KEY ?? undefined,
          cert: process.env.DATABASE_CERT ?? undefined,
        }
      : undefined,
    options: routingId || undefined,
  },
} as DataSourceOptions);

export { AppDataSource };
