import fs from "node:fs/promises";
import Path from "node:path";
import { parse } from "./parse";
import { generate } from "./generate";

async function main() {
  const input = await fs.readFile(Path.resolve("debug.txt"), { encoding: "utf-8" });
  const snowTree = parse(input);
  //console.log(util.inspect(snowTree, { depth: 30 }));
  const json = generate(snowTree);
  //console.log(json);
}
main()
.catch(err => { console.error(err); });
