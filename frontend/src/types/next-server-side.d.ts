import { Requester } from '@/libs/requester/Requester';
import { ErrorProps } from '@/pages/_error';
import { UserEntity } from '@api/entities/user.entity';
import { EmotionCache } from '@emotion/react';
import { Request as ExpressRequest, Response } from 'express';
import type { Session as ExprssSession } from 'express-session';
import { GetServerSidePropsResult, PreviewData } from 'next';

export type CommonProps = Partial<ErrorProps> & {
  user?: UserEntity | null;
  // TODO 필요한지 체크
  accessToken?: string | null;
  isLoggedIn?: boolean;
  emotionCache?: EmotionCache;
  csrf?: string | null;
};

export type Session = ExprssSession & CommonProps;

export type Request = ExpressRequest & {
  session: Session;
  requester: Requester;
  error?: unknown | null;
};

export type GetServerSidePropsContext<
  Params extends {} = {},
  Query extends {} = {},
  Preview extends PreviewData = PreviewData,
> = {
  req: Request;
  res: Response;
  params?: Params;
  query: Query;
  preview?: boolean;
  previewData?: Preview;
  resolvedUrl: string;
  locale?: string;
  locales?: string[];
  defaultLocale?: string;
};

export type GetServerSideProps<
  Props extends {} = {},
  Params extends {} = {},
  Query extends {} = {},
  Preview extends PreviewData = PreviewData,
> = (
  context: GetServerSidePropsContext<Params, Query, Preview>,
) => Promise<GetServerSidePropsResult<Props>> | GetServerSidePropsResult<Props>;
