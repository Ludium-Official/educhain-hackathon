import Layout from "@/components/common/layout";
import { withSession } from "@/middlewares/withSession";
import { CommonProps, GetServerSideProps } from "@/types/next-server-side";
import { NextPage } from "next";

interface ProgramProps extends CommonProps {}

const Program: NextPage<ProgramProps> = () => {
  return (
    <Layout>
      {{
        body: <div>Program</div>,
      }}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<ProgramProps> =
  withSession<ProgramProps>(async (context) => {
    const req = context.req;

    return {
      props: {},
    };
  });

export default Program;
