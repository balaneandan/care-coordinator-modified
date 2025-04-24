import { ErrorMsg } from "@/types/api";
import FetchClient from "./fetch-client";

type DataResponse<T> = {
  data: T | null;
  isLoading: boolean;
  error: ErrorMsg | null;
};

export async function post<T>(
  url: string,
  postData: object | FormData
): Promise<DataResponse<T>> {
  const fetch = new FetchClient();
  return await fetch.post<T>(url, postData);
}
