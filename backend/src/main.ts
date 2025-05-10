import { readFile } from "node:fs/promises";
import { configureAuth } from "./core/authorization.js";
import { connectDB } from "./core/database.js";
import { getEnvInteger } from "./core/env.js";
import { createHttpServer, listenHttpServer } from "./core/httpServer.js";
import { configureRestApi } from "./core/restApi.js";

async function bootstrap() {
  const projectInfo = JSON.parse(await readFile("../package.json", { encoding: "utf8" }));

  console.log("+----------------------------------+");
  console.log("|          Frost *                 |");
  console.log("|          backend server          |");
  console.log("+----------------------------------+");
  console.log(`Version ${projectInfo.version}`);
  console.log();

  // TODO: validate config

  const db = connectDB();
  configureAuth(db);

  const http = createHttpServer();
  configureRestApi(http, db);

  // listen http
  const listenPort = getEnvInteger("LISTEN_PORT", 3000);
  await listenHttpServer(http, listenPort);
  console.log(`listening on http://localhost:${listenPort}`);
}
bootstrap()
.catch(err => {
  console.error(err);
});
