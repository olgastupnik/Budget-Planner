import app from "./app";
import { postgresDB } from "./databases/postgres-db";
import Config from "./env";

async function start() {
  try {
    postgresDB().then(() =>
      app.listen(Config.port, () =>
        console.log(`App has been started on port ${Config.port}...`)
      )
    );
  } catch (err: any) {
    console.log(err.message);
    process.exit(1);
  }
}

start();
