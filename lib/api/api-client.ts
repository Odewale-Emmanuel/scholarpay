import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export interface NetworkRequestReturnType<T = unknown> {
  code: number;
  status: "success" | "failed";
  data?: T;
  headers?: Record<string, string>;
}

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

type BaseRequest = {
  url: string;
  headers?: Record<string, string>;
};

export type QueryRequestType = BaseRequest & {
  payload?: Record<string, unknown>;
};

export type MutateRequestType = BaseRequest & {
  payload?: unknown;
};

export interface ApiClient {
  get<T = unknown>(
    props: QueryRequestType,
  ): Promise<NetworkRequestReturnType<T>>;

  post<T = unknown>(
    props: MutateRequestType,
  ): Promise<NetworkRequestReturnType<T>>;

  put<T = unknown>(
    props: MutateRequestType,
  ): Promise<NetworkRequestReturnType<T>>;

  patch<T = unknown>(
    props: MutateRequestType,
  ): Promise<NetworkRequestReturnType<T>>;

  delete<T = unknown>(
    props: QueryRequestType,
  ): Promise<NetworkRequestReturnType<T>>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return config;
});

const request = async <T = unknown>(
  method: HttpMethod,
  props: QueryRequestType | MutateRequestType,
): Promise<NetworkRequestReturnType<T>> => {
  const { url, headers } = props;
  const payload = props.payload;

  const config: AxiosRequestConfig = {
    method,
    url: buildUrl(url),
    headers: normalizeHeaders(headers),
  };

  if (payload !== undefined) {
    if (method === "get" || method === "delete") {
      config.params = payload;
    } else {
      config.data = payload;
    }
  }

  try {
    const response = await axiosInstance.request<T>(config);

    return {
      code: response.status,
      status: "success",
      data: response.data,
      headers: response.headers as Record<string, string>,
    };
  } catch (error) {
    const errorResponse = handleError<T>(error);
    throw errorResponse;
  }
};

const buildUrl = (url: string): string => {
  return url.startsWith("/") ? url : `/${url}`;
};

const normalizeHeaders = (
  headers?: Record<string, string>,
): Record<string, string> | undefined => {
  return headers ? { ...headers } : undefined;
};

const handleError = <T>(error: unknown): NetworkRequestReturnType<T> => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<T>;

    return {
      code: axiosError.response?.status ?? 500,
      status: "failed",
      data: axiosError.response?.data,
    };
  }

  return {
    code: 500,
    status: "failed",
    data: undefined,
  };
};

export const apiClient: ApiClient = {
  get: (props) => request("get", props),
  post: (props) => request("post", props),
  put: (props) => request("put", props),
  patch: (props) => request("patch", props),
  delete: (props) => request("delete", props),
};
