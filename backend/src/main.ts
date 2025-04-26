import { readFile } from "node:fs/promises";
import * as authentication from "./core/authentication";
import * as database from "./core/database";
import * as httpServer from "./core/httpServer";
import * as restApi from "./core/restApi";

async function bootstrap() {
  const projectInfo = JSON.parse(await readFile("../package.json", { encoding: "utf8" }));

  console.log("+----------------------------------+");
  console.log("|          Frost *                 |");
  console.log("|          backend server          |");
  console.log("+----------------------------------+");
  console.log(`Version ${projectInfo.version}`);
  console.log();

  // TODO: validate config

  const db = database.configure();
  authentication.configure(db);

  const app = httpServer.configure();
  restApi.configure(db, app);

  // listen http
  const port = process.env.LISTEN_PORT;
  await new Promise<void>(resolve => {
    app.listen(port, () => resolve());
  });
  console.log(`listen on port ${port}`);
}
bootstrap()
.catch(err => {
  console.error(err);
});
