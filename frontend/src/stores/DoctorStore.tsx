import FetchClient from "@/lib/fetch-client";
import { ErrorMsg } from "@/types/api";
import { Doctor } from "@/types/common";

import { StateCreator } from "zustand";

type Error = ErrorMsg | null;

export type DoctorStore = {
  doctors: Doctor[] | null;
  doctor: Doctor | null;
  doctorsLoading: boolean;
  doctorError: Error;
  fetchDoctors: () => Promise<void>;
  fetchDoctor: (id: string) => Promise<void>;
};

const fetch = new FetchClient(undefined, "/doctor");

const APIAction = <T, Params = void>(
  apiCall: (
    params: Params
  ) => Promise<{ data: T | null; isLoading: boolean; error: Error }>,
  setState: (state: Partial<DoctorStore>) => void,
  stateKey: keyof DoctorStore
) => {
  return async (params: Params) => {
    setState({ doctorsLoading: true });
    const { data, isLoading, error } = await apiCall(params);
    setState({
      [stateKey]: data,
      doctorsLoading: isLoading,
      doctorError: error,
    });
  };
};

export const createDoctorStore: StateCreator<DoctorStore> = (set) => ({
  doctors: null,
  doctor: null,
  doctorsLoading: true,
  doctorError: null,
  fetchDoctors: APIAction(() => fetch.get<Doctor[]>("/list"), set, "doctors"),
  fetchDoctor: APIAction(
    (id: string) => fetch.get<Doctor>(`/${id}`),
    set,
    "doctor"
  ),
});
