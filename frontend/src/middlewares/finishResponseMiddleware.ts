import { NextFunction, Request, Response } from 'express';

export const finishResponseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  function finishResponse() {
    res.removeListener('finish', finishResponse);
    res.removeListener('close', finishResponse);
  }

  res.on('finish', finishResponse);
  res.on('close', finishResponse);

  next();
};
