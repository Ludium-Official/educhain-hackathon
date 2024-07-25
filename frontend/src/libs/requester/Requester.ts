import axios, { type AxiosRequestConfig, type Method } from "axios";

import { boundMethod } from "autobind-decorator";
import { mergeDeepRight } from "ramda";
import { FailedAxiosData } from "@/functions/axios-function";

export abstract class Requester {
  constructor(
    private host: string = "",
    private options: AxiosRequestConfig = {}
  ) {}

  @boundMethod
  makeUrl(url: string): string {
    return `${this.host}${url}`;
  }

  @boundMethod
  async fetch<T extends { [key: string]: any }>(
    url: string,
    method: Method = "GET",
    data?: any,
    options: AxiosRequestConfig = {}
  ): Promise<T | FailedAxiosData> {
    const callUrl = this.makeUrl(url);

    const mergedOptions = mergeDeepRight<
      AxiosRequestConfig,
      AxiosRequestConfig
    >(this.options, options) as AxiosRequestConfig;

    const params = method.toLowerCase() === "post" ? undefined : data;

    try {
      const result = await axios<T>({
        method,
        url: callUrl,
        data,
        params,
        timeout: 5 * 1000,
        headers: {
          ...mergedOptions?.headers,
        },
        ...mergedOptions,
      });

      return result.data;
    } catch (err: any) {
      if (err.response?.data) {
        return err.response.data as FailedAxiosData;
      }

      throw err;
    }
  }
}
