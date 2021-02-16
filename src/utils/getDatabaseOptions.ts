import { __prod__ } from '../constants';
import { ConnectionOptions } from 'typeorm';

export const getOptions = async () => {
  let connectionOptions: ConnectionOptions;
  if (__prod__) {
    connectionOptions = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      entities: ['dist/entities/*.*'],
    };
  } else {
    connectionOptions = {
      type: 'postgres',
      database: 'gardeniox',
      username: 'faust',
      password: '4532164mine',
      entities: ['dist/entities/*.*'],
    };
  }
  return connectionOptions;
};
