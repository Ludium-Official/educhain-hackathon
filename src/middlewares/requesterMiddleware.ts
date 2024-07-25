import { NextFunction, Response } from 'express';

import { Request } from '@/types/next-server-side';
import { ServerRequester } from '@/libs/requester/ServerRequester';

export const requesterMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const requester = new ServerRequester();

  req.requester = requester;

  next();
};
