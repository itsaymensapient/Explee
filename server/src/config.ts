import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 3001),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  expleeApiKey: process.env.EXPLEE_API_KEY?.trim() ?? "",
  expleeBaseUrl: (
    process.env.EXPLEE_BASE_URL ?? "https://api.explee.com/public/api/v1"
  ).replace(/\/$/, ""),
};

export function isKeyConfigured(): boolean {
  return config.expleeApiKey.length > 0;
}
