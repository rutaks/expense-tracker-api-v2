import DbConfig from '../interfaces/db-config.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicModule } from '@nestjs/common';

const getDbConfig = (): DbConfig => {
  return {
    host: process.env.TEST_DB_HOST,
    port: parseInt(process.env.TEST_DB_PORT),
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
  };
};

export const getTestingTypeOrmConfig = (): DynamicModule => {
  return TypeOrmModule.forRoot({
    ...getDbConfig(),
    type: 'postgres',
    entities: [
      __dirname + '/../**/*.entity.js',
      __dirname + '/../**/*.entity.ts',
    ],
    synchronize: true,
    logging: false,
    autoLoadEntities: true,
  });
};
