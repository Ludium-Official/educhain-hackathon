import { Request } from '@/types/next-server-side';

export const destroySession = (req: Request) => {
  const session = req.session;

  if (!session) {
    return;
  }

  session.accessToken = null;
  session.user = null;
  session.isLoggedIn = false;

  session.save();
};
