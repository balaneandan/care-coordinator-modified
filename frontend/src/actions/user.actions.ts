"use server";

import FetchClient from "@/lib/fetch-client";
import { CreateUser, SignInUser, User, VerifyOTP } from "@/types/api";

const fetch2 = new FetchClient(undefined, "/auth/user");

export const addUser = async (userData: CreateUser) => {
  const { data: user, error: userError } = await fetch2.post<User>(
    "/auth/user/register",
    userData
  );
  return { user, userError };
};


export type LoginResponse =
  | { user: { challengeId: string; session_token: string }; userError: null }
  | { user: null; userError: string };

export const loginUser = async (userData: SignInUser): Promise<LoginResponse> => {
  try {
    const res = await fetch(`http://localhost:8000/auth/login-init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { user: null, userError: errorText };
    }

    const data = await res.json();
    return {
      user: {
        challengeId: data.challengeId,
        session_token: data.session_token,
      },
      userError: null,
    };
  } catch (err) {
    return {
      user: null,
      userError: "Error",
    };
  }
};

export const verifyOTP = async (verifyOTP: VerifyOTP): Promise<any> => {
  try {
    const res = await fetch(`http://localhost:8000/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifyOTP),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { user: null, userError: errorText };
    }

    const data = await res.json();
    return {
      msg: {
        access_token: data.access_token,
        userId: data.userId
      },
      error: null,
    };
  } catch (err) {
    return {
      msg: null,
      error: "Error",
    };
  }
};

export const loginAdmin = async (data: string): Promise<any> => {
  try {
    const res = await fetch(`http://localhost:8000/auth/login-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { user: null, userError: errorText };
    }

    const responseData = await res.json();
    return {
      msg: {
        access_token: responseData.access_token,
        userId: responseData.userId
      },
      error: null,
    };
  } catch (err) {
    return {
      msg: null,
      error: "Error",
    };
  }
};