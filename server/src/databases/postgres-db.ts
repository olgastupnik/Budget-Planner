import { Connection, createConnection } from "typeorm";

import Config from "../env";

export const postgresDB = (): Promise<Connection> => {
  const { port, host, username, password, database } = Config.db;

  return createConnection({
    type: "postgres",
    host: host,
    port: Number(port),
    username,
    password,
    database,
    logging: true,
    synchronize: false,
    ssl: {
      rejectUnauthorized: false,
    },
    entities: ["src/entity/*.ts"],
    migrations: ["src/migrations/*.ts"],
    cli: {
      migrationsDir: "src/migrations",
    },
  });
};
