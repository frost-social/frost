import fs from "node:fs/promises";
import Path from "node:path";
import { parse } from "./parse";
import util from "node:util";

async function main() {
  const input = await fs.readFile(Path.resolve("debug.txt"), { encoding: "utf-8" });

  const file = parse(input);

  console.log(util.inspect(file, { depth: 10 }));
}
main()
.catch(err => { console.error(err); });
