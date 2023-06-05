export interface SendBuyTokenResult {
  data: Data;
  status: number;
  statusText: string;
  headers: Headers;
  config: Config;
  request: Request;
}

export interface Config {
  transitional: Transitional;
  adapter: string[];
  transformRequest: null[];
  transformResponse: null[];
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  env: Request;
  headers: ConfigHeaders;
  method: string;
  url: string;
  data: string;
}

export interface Request {}

export interface ConfigHeaders {
  Accept: string;
  'Content-Type': string;
}

export interface Transitional {
  silentJSONParsing: boolean;
  forcedJSONParsing: boolean;
  clarifyTimeoutError: boolean;
}

export interface Data {
  msg: string;
  result: boolean;
}

export interface Headers {
  'content-length': string;
  'content-type': string;
}
