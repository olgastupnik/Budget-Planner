import path from "path";
import * as dotenv from "dotenv";

const isTest = typeof global.it === "function";

const dotenvPath = isTest
  ? path.join(__dirname, "..", ".test.env")
  : path.join(__dirname, "..", ".env");

dotenv.config({ path: dotenvPath });

export default {
  port: process.env.PORT,
  secretKey: process.env.jwtSecret || "secret",
  baseUrl: process.env.baseUrl || "",
  skip: 0,
  limit: 10,

  db: {
    port: process.env.TYPEORM_PORT || 3002,
    password: process.env.TYPEORM_PASSWORD || "password",
    database: process.env.TYPEORM_DATABASE || "",
    host: process.env.TYPEORM_HOST || "host",
    username: process.env.TYPEORM_USERNAME || "user name",
    logging: process.env.TYPEORM_LOGGING || true,
    synchronize: process.env.TYPEORM_SYNCHRONIZE || false,
    migrations: process.env.TYPEORM_MIGRATIONS || [],
    entities: process.env.TYPEORM_ENTITIES || [],
    dbURL: process.env.DATABASE_URL || "",
    entitiesDir: process.env.TYPEORM_ENTITIES_DIR || "",
    migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR || "",
  },
};
