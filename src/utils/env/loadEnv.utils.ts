import dotenv from "dotenv";

export function loadEnv() {
  dotenv.config({ path: ".env" });
  const env = process.env.ENV ?? "local";
  dotenv.config({ path: `.env.${env}`, override: true });
}
