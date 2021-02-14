import { ConnectionOptions } from 'typeorm';
import { Disease, Plant, Plot, User } from '../entities/index';

export const getDatabaseOptions = (): ConnectionOptions => {
  return {
    type: 'postgres',
    database: 'gardeniox',
    username: 'faust',
    password: '4532164mine',
    logging: true,
    synchronize: true,
    entities: [Plant, Plot, User, Disease],
  };
};
