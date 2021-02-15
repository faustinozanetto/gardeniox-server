import 'reflect-metadata';
import cors from 'cors';
import express from 'express';
import Redis from 'ioredis';
import { ApolloServer } from 'apollo-server-express';
import { Connection, createConnection } from 'typeorm';
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
import { APP_URL, COOKIE_NAME, __prod__ } from './constants';
import { DATABASE_URL } from './utils/config';
let connection: Connection;

const PORT = process.env.port || 4000;

const main = async () => {
  try {
    // Database connection
    connection = await createConnection({
      url: DATABASE_URL,
      type: 'postgres',
      extra: { ssl: true, rejectUnauthorized: false },
      entities: [Plant, Plot, User, Disease],
    });
  } catch (error) {
    console.error(
      'An error occurred while trying to initialize connection to database!',
      error
    );
    process.exit();
  }
  console.log(
    'Successfully connected to database:',
    connection.options.database
  );

  // Express app
  const app = express();

  // Redis setup
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: APP_URL,
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
    context: ({ req, res }) => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  // Server listening
  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server started on port ${PORT}`);
  });
};

export const getConnection = () => {
  return connection;
};

main().catch((error) => {
  console.error(error);
});
