const rawBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXTPUBLICBASEURL ||
  "http://localhost:5000/api/v1";

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const APP_CONFIG = {
  name: "InfinityFX Admin",
};
