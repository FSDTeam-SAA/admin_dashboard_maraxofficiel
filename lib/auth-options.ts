import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_BASE_URL } from "@/lib/env";

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    role: string;
    _id: string;
    user: Record<string, unknown>;
  };
};

const getAccessTokenExpiresAt = (accessToken: string) => {
  try {
    const payloadBase64 = accessToken.split(".")[1];
    const payload = JSON.parse(
      Buffer.from(payloadBase64, "base64").toString("utf8")
    ) as { exp?: number };
    if (!payload.exp) return Date.now() + 60 * 60 * 1000;
    return payload.exp * 1000;
  } catch {
    return Date.now() + 60 * 60 * 1000;
  }
};

const refreshAccessToken = async (token: {
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpires?: number;
  role?: string;
  _id?: string;
  user?: Record<string, unknown>;
}) => {
  if (!token.refreshToken) {
    return {
      ...token,
      error: "NoRefreshToken",
    };
  }

  try {
    const response = await axios.post<{
      success: boolean;
      message: string;
      data: {
        accessToken: string;
        refreshToken: string;
      };
    }>(`${API_BASE_URL}/auth/refresh-token`, {
      refreshToken: token.refreshToken,
    });

    const refreshed = response.data.data;

    return {
      ...token,
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      accessTokenExpires: getAccessTokenExpiresAt(refreshed.accessToken),
      error: undefined,
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          const response = await axios.post<LoginResponse>(
            `${API_BASE_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const payload = response.data.data;
          if (!payload?.accessToken) {
            return null;
          }

          const userData = payload.user || {};
          const email =
            (userData.email as string | undefined) || credentials.email;
          const name =
            (userData.name as string | undefined) ||
            (userData.username as string | undefined) ||
            email;

          return {
            id: payload._id,
            name,
            email,
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
            role: payload.role,
            _id: payload._id,
            user: userData,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const accessToken = user.accessToken as string;
        return {
          ...token,
          accessToken,
          refreshToken: user.refreshToken,
          role: user.role,
          _id: user._id,
          user: user.user,
          accessTokenExpires: getAccessTokenExpiresAt(accessToken),
        };
      }

      if (
        token.accessToken &&
        token.accessTokenExpires &&
        Date.now() < Number(token.accessTokenExpires) - 10_000
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      session.role = token.role as string | undefined;
      session._id = token._id as string | undefined;
      session.error = token.error as string | undefined;
      session.user = {
        ...session.user,
        ...(token.user as Record<string, unknown>),
      };
      return session;
    },
  },
};
