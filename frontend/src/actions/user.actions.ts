"use server";

import FetchClient from "@/lib/fetch-client";
import { CreateUser, User } from "@/types/api";

const fetch = new FetchClient(undefined, "/auth/user");

export const addUser = async (userData: CreateUser) => {
  const { data: user, error: userError } = await fetch.post<User>(
    "/register",
    userData
  );
  return { user, userError };
};
