import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config = (): {
  port: number;
  env: any;
  database: TypeOrmModuleOptions;
  jwt: { secretKey: any; expiresIn: any };
} => ({
  port: parseInt(process.env.PORT),
  env: process.env.NODE_ENV,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    type: 'postgres',
    entities: [
      __dirname + '/../**/*.entity.js',
      __dirname + '/../**/*.entity.ts',
    ],
    dropSchema: process.env.NODE_ENV === 'development',
    synchronize: true,
    logging: true,
    autoLoadEntities: true,
    cache: {
      //TODO: SETUP CONTAINER WITH redis IMG
      // type: 'redis',
      duration: 10000,
    },
  },
  jwt: {
    secretKey: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
});
