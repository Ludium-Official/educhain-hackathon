import Layout from "@/components/common/layout";
import { withSession } from "@/middlewares/withSession";
import { CommonProps, GetServerSideProps } from "@/types/next-server-side";
import { NextPage } from "next";

interface ParticipationProps extends CommonProps {}

const Participation: NextPage<ParticipationProps> = () => {
  return (
    <Layout>
      {{
        body: <div>Participation</div>,
      }}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<ParticipationProps> =
  withSession<ParticipationProps>(async (context) => {
    const req = context.req;

    return {
      props: {},
    };
  });

export default Participation;
