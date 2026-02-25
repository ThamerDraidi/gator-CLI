import { defineConfig } from "drizzle-kit";
import fs from "fs";


const config = JSON.parse(fs.readFileSync(".gatorconfig.json", "utf-8"));

export default defineConfig({
  schema: "src/schema.ts",
  out: "src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config.db_url, 
  },
});