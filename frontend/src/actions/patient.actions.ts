"use server";

import FetchClient from "@/lib/fetch-client";
import { APIDataId, CreatePatient } from "@/types/api";

const fetch = new FetchClient(undefined, "/api/patient");

export const addPatient = async (patientData: CreatePatient) => {
  const { data: patient, error: patientError } = await fetch.post<APIDataId>(
    "/register",
    patientData
  );
  return { patient, patientError };
};

export const uploadFile = async (fileData: FormData) => {
  const { data: fileDetails, error: fileError } = await fetch.post<APIDataId>(
    "/upload",
    fileData
  );
  return { fileDetails, fileError };
};
