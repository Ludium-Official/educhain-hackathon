import Layout from "@/components/common/layout";
import { withSession } from "@/middlewares/withSession";
import { CommonProps, GetServerSideProps } from "@/types/next-server-side";
import { NextPage } from "next";

interface ManagementProps extends CommonProps {}

const Management: NextPage<ManagementProps> = () => {
  return (
    <Layout>
      {{
        body: <div>Management</div>,
      }}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<ManagementProps> =
  withSession<ManagementProps>(async (context) => {
    const req = context.req;

    return {
      props: {},
    };
  });

export default Management;
