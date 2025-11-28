import axios from "axios";

export const KHALTI_CONFIG = {
  baseUrl: "https://a.khalti.com/api/v2",
  secretKey: process.env.KHALTI_SECRET_KEY ?? "",
} as const;

export const khaltiClient = axios.create({
  baseURL: KHALTI_CONFIG.baseUrl,
  headers: {
    Authorization: `Key ${KHALTI_CONFIG.secretKey}`,
    "Content-Type": "application/json",
  },
});
