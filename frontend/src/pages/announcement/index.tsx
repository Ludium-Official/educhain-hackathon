import Layout from "@/components/common/layout";
import { withSession } from "@/middlewares/withSession";
import { CommonProps, GetServerSideProps } from "@/types/next-server-side";
import { NextPage } from "next";

interface AnnouncementProps extends CommonProps {}

const Announcement: NextPage<AnnouncementProps> = () => {
  return (
    <Layout>
      {{
        body: <div>Announcement</div>,
      }}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<AnnouncementProps> =
  withSession<AnnouncementProps>(async (context) => {
    const req = context.req;

    return {
      props: {},
    };
  });

export default Announcement;
