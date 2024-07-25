import Layout from "@/components/common/layout";
import { withSession } from "@/middlewares/withSession";
import { CommonProps, GetServerSideProps } from "@/types/next-server-side";
import { NextPage } from "next";

interface WorkProps extends CommonProps {}

const Work: NextPage<WorkProps> = () => {
  return (
    <Layout>
      {{
        body: <div>Work</div>,
      }}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<WorkProps> =
  withSession<WorkProps>(async (context) => {
    const req = context.req;

    return {
      props: {},
    };
  });

export default Work;
