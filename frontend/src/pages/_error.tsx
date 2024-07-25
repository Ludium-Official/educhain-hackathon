import Layout from "@/components/common/layout";
import { FailedAxiosData } from "@/functions/axios-function";
import { withSession } from "@/middlewares/withSession";
import { NextPage } from "@/types/next-page";
import { GetServerSideProps } from "@/types/next-server-side";
import { HttpStatusCode } from "axios";
import { ErrorStatus } from "./styled";

const Error: NextPage<Partial<FailedAxiosData>> = ({ statusCode, message }) => {
  return (
    <Layout>
      {{
        body: (
          <div>
            <ErrorStatus>
              {statusCode ? (
                <>
                  An error {statusCode} occurred on server {message}
                </>
              ) : (
                <>An error occurred on client {message}</>
              )}
            </ErrorStatus>
          </div>
        ),
      }}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<FailedAxiosData> =
  withSession<FailedAxiosData>(async () => {
    const error = {
      statusCode: HttpStatusCode.InternalServerError,
      message: "An error occurred on server",
    };

    return {
      props: error,
    };
  });

export default Error;
