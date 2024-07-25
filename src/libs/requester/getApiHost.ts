export const getApiServerHost = () => {
  if (process.env.RUN_MODE === "production") {
    return process.env.NEXT_PUBLIC_PROD_API_SERVER_BASE_URL;
  }

  return process.env.NEXT_PUBLIC_LOCAL_API_SERVER_BASE_URL;
};
