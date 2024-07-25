import { AxiosRequestConfig } from "axios";
import { Requester } from "./Requester";
import { getApiServerHost } from "./getApiHost";

export class ServerRequester extends Requester {
  constructor() {
    const axiosOptions: AxiosRequestConfig = {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_LUDIUM_SECRET_KEY,
      },
    };

    super(getApiServerHost(), axiosOptions);
  }
}
