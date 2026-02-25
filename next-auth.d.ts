import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    _id?: string;
    error?: string;
    user: DefaultSession["user"] & Record<string, unknown>;
  }

  interface User extends DefaultUser {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    _id?: string;
    user?: Record<string, unknown>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    role?: string;
    _id?: string;
    user?: Record<string, unknown>;
    error?: string;
  }
}
