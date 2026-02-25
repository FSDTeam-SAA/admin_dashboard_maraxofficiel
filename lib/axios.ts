"use client";

import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { API_BASE_URL } from "@/lib/env";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let signingOut = false;

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  const accessToken = session?.accessToken;

  if (accessToken) {
    config.headers = config.headers || {};
    (config.headers as Record<string, string>).Authorization =
      `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401 && !signingOut) {
      signingOut = true;
      await signOut({ callbackUrl: "/login" });
      signingOut = false;
    }

    return Promise.reject(error);
  }
);
