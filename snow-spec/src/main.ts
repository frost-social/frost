import fs from "node:fs/promises";
import Path from "node:path";
import { parse } from "./parse";
import { generate } from "./generate";
import { resolve } from "./resolve";

async function main() {
  const input = await fs.readFile(Path.resolve("debug.txt"), { encoding: "utf-8" });
  const snowTree = parse(input);
  //console.log(util.inspect(snowTree, { depth: 30 }));
  const symbolTable = new Map();
  resolve(snowTree, symbolTable);
  const json = generate(snowTree, symbolTable);
  //console.log(json);
}
main()
.catch(err => { console.error(err); });
