import fs from "node:fs/promises";
import Path from "node:path";
import { resolve } from "./resolve";
import { emit } from "./emit";
import { parse } from "./parse";

async function main() {
  const input = await fs.readFile(Path.resolve("debug.txt"), { encoding: "utf-8" });
  const syntaxNode = parse(input);
  //console.log(util.inspect(syntaxNode, { depth: 30 }));
  resolve(syntaxNode);
  const json = emit(syntaxNode);
}
main()
.catch(err => { console.error(err); });
