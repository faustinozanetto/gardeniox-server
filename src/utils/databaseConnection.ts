import { ConnectionOptions } from 'typeorm';
import { Disease, Plant, Plot, User } from '../entities/index';
import { __prod__ } from '../constants';

export const getDatabaseOptions = (): ConnectionOptions => {
  return {
    type: 'postgres',
    host: __prod__ ? '192.168.1.106' : 'localhost',
    port: 3306,
    database: 'gardeniox',
    username: 'faust',
    password: '4532164mine',
    logging: true,
    synchronize: true,
    entities: [Plant, Plot, User, Disease],
  };
};
