import { Request, Response } from 'express';
//@ts-ignore
import { Session, SessionData } from 'express-session';
//@ts-ignore
import { Redis } from 'ioredis';

//@ts-ignore
export type GardenioxContext = {
  req: Request & {
    //@ts-ignore
    session: Session & Partial<SessionData> & { userId: number };
  };
  res: Response;
  //@ts-ignore
  redis: Redis;
};
