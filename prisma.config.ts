import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // The driver adapter in prisma/client.ts uses DATABASE_URL (pooled) at runtime.
  // The CLI/migrations must use the direct connection to avoid pgbouncer.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
