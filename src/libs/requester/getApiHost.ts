export const getApiServerHost = () => {
  if (process.env.RUN_MODE === "production") {
    return process.env.PROD_API_SERVER_BASE_URL;
  }

  return process.env.LOCAL_API_SERVER_BASE_URL;
};
