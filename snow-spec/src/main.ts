import fs from "node:fs/promises";
import Path from "node:path";
import { emit } from "./emit";
import { parse } from "./parse";
import { resolve } from "./resolve";

async function main() {
  const input = await fs.readFile(Path.resolve("debug.txt"), { encoding: "utf-8" });
  const syntaxNode = parse(input);
  //console.log(util.inspect(syntaxNode, { depth: 30 }));
  resolve(syntaxNode);
  //const json = emit();
}
main()
.catch(err => { console.error(err); });
