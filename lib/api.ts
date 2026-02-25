"use client";

import { AxiosError } from "axios";
import { apiClient, publicApiClient } from "@/lib/axios";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type DashboardStats = {
  year: number;
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  monthlyJoinings: Array<{
    month: number;
    label: string;
    count: number;
  }>;
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string | null;
  spentOnSubscription: number;
  planName: string;
  status: "Paid" | "Free";
};

export type AdminUsersResponse = {
  users: AdminUser[];
  pagination: PaginationMeta;
};

export type SubscriptionPlan = {
  _id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: "month" | "one-time";
  description: string;
  benefits: string[];
  icon: "sparkle" | "zap" | "crown";
  accentColor: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type SubscriptionPlansResponse = {
  plans: SubscriptionPlan[];
  pagination: PaginationMeta;
};

export type Profile = {
  _id: string;
  name?: string;
  username?: string;
  email: string;
  avatar?: {
    public_id?: string;
    url?: string;
  };
  role?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type PlanPayload = {
  name: string;
  price: number;
  billingCycle: "month" | "one-time";
  description: string;
  benefits: string[];
  icon: "sparkle" | "zap" | "crown";
  accentColor?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  password: string;
};

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

export const getApiErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "Request failed"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

export const getDashboardStats = async (year?: number) => {
  const response = await apiClient.get<ApiResponse<DashboardStats>>(
    "/admin/dashboard/stats",
    {
      params: year ? { year } : undefined,
    }
  );
  return unwrap(response);
};

export const getAdminUsers = async (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const response = await apiClient.get<ApiResponse<AdminUsersResponse>>(
    "/admin/users",
    {
      params,
    }
  );
  return unwrap(response);
};

export const getSubscriptionPlans = async (params: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const response = await apiClient.get<ApiResponse<SubscriptionPlansResponse>>(
    "/admin/plans",
    {
      params,
    }
  );
  return unwrap(response);
};

export const getSubscriptionPlanById = async (id: string) => {
  const response = await apiClient.get<ApiResponse<SubscriptionPlan>>(
    `/admin/plans/${id}`
  );
  return unwrap(response);
};

export const createSubscriptionPlan = async (payload: PlanPayload) => {
  const response = await apiClient.post<ApiResponse<SubscriptionPlan>>(
    "/admin/plans",
    payload
  );
  return unwrap(response);
};

export const updateSubscriptionPlan = async (
  id: string,
  payload: Partial<PlanPayload>
) => {
  const response = await apiClient.put<ApiResponse<SubscriptionPlan>>(
    `/admin/plans/${id}`,
    payload
  );
  return unwrap(response);
};

export const getProfile = async () => {
  const response = await apiClient.get<ApiResponse<Profile>>("/user/profile");
  return unwrap(response);
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const response = await apiClient.put<ApiResponse<null>>(
    "/user/password",
    payload
  );
  return response.data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const response = await publicApiClient.post<ApiResponse<null>>(
    "/auth/forgot-password",
    payload
  );
  return response.data;
};

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const response = await publicApiClient.post<ApiResponse<null>>(
    "/auth/verify-otp",
    payload
  );
  return response.data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const response = await publicApiClient.post<ApiResponse<null>>(
    "/auth/reset-password",
    payload
  );
  return response.data;
};
