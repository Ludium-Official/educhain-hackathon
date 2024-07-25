import { GetServerSideProps, GetServerSidePropsContext } from '@/types/next-server-side';

import { getServerSideApp } from './getServerSideApp';

export const withSession =
  <P extends {} = {}, B extends {} = {}, Q extends {} = {}>(
    handler: GetServerSideProps<P, B, Q>,
    binder?: (app: any) => void,
  ) =>
  async (context: GetServerSidePropsContext<B, Q>) => {
    const app = getServerSideApp();
    const req = context.req;

    req.error = null;

    binder?.(app);

    try {
      await app.run(req, context.res);
    } catch (err) {
      req.error = err || null;
    }

    const result = await handler(context);

    return result;
  };
