import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import Redis from 'ioredis';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import {
  PlantResolver,
  DiseaseResolver,
  PlotResolver,
  UserResolver,
} from './resolvers';
import connectRedis from 'connect-redis';
import { Disease, Plant, Plot, User } from './entities/index';
// import { getOptions } from './utils/getDatabaseOptions';
import session from 'express-session';
import { COOKIE_NAME, __prod__ } from './constants';

const main = async () => {
  // Database connection
  const connection = await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    // ssl: true, // database: 'gardeniox',
    ssl: {
      rejectUnauthorized: false,
    },
    // username: 'faust',
    // password: '4532164mine',
    logging: true,
    synchronize: true,
    entities: [Plant, Plot, User, Disease],
  });

  console.log('Successfully connected to database', connection.name);

  // Express app
  const app = express();

  // Redis setup
  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  // Cors middleware
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: 'qowiueojwojfalksdjoqiwueo',
      resave: false,
    })
  );

  // Creating apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, PlantResolver, PlotResolver, DiseaseResolver],
      validate: false,
    }),
    introspection: true,
    playground: true,
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.get('/hi', (_req, res) => res.send('Hello'));

  app.get('/', (_req, res) => res.send('Working'));

  // Server listening
  app.listen(parseInt(process.env.PORT) || 4000, () => {
    console.log('server started on localhost:4000');
  });
};

main().catch((error) => {
  console.error(error);
});
