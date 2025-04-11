import config from "@/lib/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

if (!config.env.databaseUrl) {
  throw new Error("Database URL is not defined");
}
const sql = neon(config.env.databaseUrl);
export const db = drizzle({ client: sql });
