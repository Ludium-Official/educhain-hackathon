import type { NextComponentType, NextPageContext } from 'next';
import { CommonProps } from './next-server-side';

type NextContext<Q> = NextPageContext & {
  query: Q;
};

type NextComponent<P extends CommonProps, IP = P> = NextComponentType<NextContext<P>, IP, P>;

export type NextPage<P extends CommonProps, IP = P> = NextComponent<P, IP> & {
  getInitialProps?(context: NextContext<P>): P | Promise<P>;
};
