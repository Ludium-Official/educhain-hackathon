import { DatabaseConfig } from "@/types/database";

export const getDatabaseConfig = (): DatabaseConfig => {
  if (process.env.RUN_MODE === "production") {
    return {
      host: process.env.NEXT_PUBLIC_PROD_DB_HOST!,
      database: process.env.NEXT_PUBLIC_PROD_DB_DATABASE!,
      user: process.env.NEXT_PUBLIC_PROD_DB_USER!,
      password: process.env.NEXT_PUBLIC_PROD_DB_PASSWORD!,
      port: Number(process.env.NEXT_PUBLIC_PROD_DB_PORT!),
      timezone: "Z",
    };
  }

  return {
    host: process.env.NEXT_PUBLIC_LOCAL_DB_HOST!,
    database: process.env.NEXT_PUBLIC_LOCAL_DB_DATABASE!,
    user: process.env.NEXT_PUBLIC_LOCAL_DB_USER!,
    password: process.env.NEXT_PUBLIC_LOCAL_DB_PASSWORD!,
    port: Number(process.env.NEXT_PUBLIC_LOCAL_DB_PORT!),
    timezone: "Z",
  };
};
