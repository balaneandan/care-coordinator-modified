import { ErrorMsg } from "@/types/api";

type DataResponse<T> = {
  data: T | null;
  isLoading: boolean;
  error: ErrorMsg | null;
};

function serverErrorMsg(): ErrorMsg {
  return {
    status: "Error",
    code: 500,
    response: "500_INTERNAL_SERVER_ERROR",
    message: "Internal server error occurred",
  };
}

class FetchClient {
  private rootUrl: string;
  private prefix: string;

  constructor(rootUrl?: string, prefix?: string) {
    this.rootUrl = rootUrl ?? this.getApiRootUrl();
    this.prefix = prefix ?? "";
  }

  public getApiRootUrl(): string {
    const isServer: boolean = typeof window === "undefined";
    return isServer
      ? process.env.NEXT_PUBLIC_FASTAPI_CONNECTION_URL!
      : process.env.NEXT_PUBLIC_ENDPOINT_URL!;
  };

  public async get<T>(
    url: string,
    headers?: HeadersInit
  ): Promise<DataResponse<T>> {
    return this._makeRequest<T>("GET", url, null, headers);
  }

  public async post<T>(
    url: string,
    data: object | FormData,
    headers?: HeadersInit
  ): Promise<DataResponse<T>> {
    return this._makeRequest<T>("POST", url, data, headers);
  }

  public async put<T>(
    url: string,
    data: object,
    headers?: HeadersInit
  ): Promise<DataResponse<T>> {
    return this._makeRequest<T>("PUT", url, data, headers);
  }

  public async patch<T>(
    url: string,
    data: object,
    headers?: HeadersInit
  ): Promise<DataResponse<T>> {
    return this._makeRequest<T>("PATCH", url, data, headers);
  }

  public async delete<T>(
    url: string,
    headers?: HeadersInit
  ): Promise<DataResponse<T>> {
    return this._makeRequest<T>("DELETE", url, null, headers);
  }

  private _setHeaders(isFormData: boolean, headers?: HeadersInit | null) {
    if (headers) {
      return headers;
    }

    return isFormData
      ? {}
      : {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      };
  }

  private async _makeRequest<T>(
    method: string,
    url: string,
    apiData?: object | FormData | null,
    headers?: HeadersInit | null
  ): Promise<DataResponse<T>> {
    let data: T | null = null;
    let error: ErrorMsg | null = null;
    let isLoading = true;


    try {
      const isFormData = apiData instanceof FormData ? true : false;
      const config: RequestInit = {
        method: method,
        headers: this._setHeaders(isFormData, headers),
      };

      if (apiData) {
        config.body = isFormData
          ? (apiData as FormData)
          : JSON.stringify(apiData);
      }

      const response = await fetch(
        `${this.rootUrl}${this.prefix}${url}`,
        config
      );
      const output = await response.json();

      if (!Object.hasOwn(output, "data")) {
        isLoading = false;
        error = output;
      } else {
        isLoading = false;
        data = output.data;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      error = serverErrorMsg();
      isLoading = false;
    }

    return { data, isLoading, error };
  }
}

export default FetchClient;
