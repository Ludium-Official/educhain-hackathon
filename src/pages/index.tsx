import { CommonProps, GetServerSideProps } from '@/types/next-server-side';

import Layout from '@/components/layout';
import { NextPage } from '@/types/next-page';
import { useMedia } from '@/hooks/useMedia';
import { withSession } from '@/middlewares/withSession';

interface HomeProps extends CommonProps {
  value: any;
  infoMessage?: string;
}

const Home: NextPage<HomeProps> = ({ value, infoMessage }) => {
  const { isMobile } = useMedia();

  return isMobile ? (
    <div>mobile</div>
  ) : (
    <Layout>
      {{
        body: (
          <div>
            {value.map((v: any) => (
              <div key={v.id}>{v.created_at}</div>
            ))}
          </div>
        ),
      }}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = withSession<HomeProps>(
  async (context) => {
    const req = context.req;
    const flash = req.session ? req.flash() : {};

    const result = await req.requester.fetch<any>('/activities');

    return {
      props: {
        value: result,
        infoMessage: flash.info?.[0] || '',
      },
    };
  },
);

export default Home;
