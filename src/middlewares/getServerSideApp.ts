import { Request } from '@/types/next-server-side';
import { Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { finishResponseMiddleware } from './finishResponseMiddleware';
import flash from 'express-flash';
import { createRouter } from 'next-connect';
import { requesterMiddleware } from './requesterMiddleware';

export const getServerSideApp = () => {
  const app = createRouter<Request, Response>().use(cors());

  // Body parser
  app.use(bodyParser.urlencoded({ extended: false }));

  // Axios requester
  app.use(requesterMiddleware);

  // After Response
  app.use(finishResponseMiddleware);

  app.use(flash());

  return app;
};
