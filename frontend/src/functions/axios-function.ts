import { isNotNil } from "ramda";

export type FailedAxiosData = {
  statusCode: number;
  message: string;
};

export const isFailedResponse = <T extends {}>(
  response: T | FailedAxiosData
): response is FailedAxiosData => {
  return (
    isNotNil((response as FailedAxiosData).statusCode) &&
    isNotNil((response as FailedAxiosData).message)
  );
};
