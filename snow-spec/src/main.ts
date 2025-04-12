import fs from "node:fs/promises";
import Path from "node:path";
//import util from "node:util";
import { analyze } from "./analyze";
import { emit } from "./emit";
import { parse } from "./parse";

async function main() {
  const input = await fs.readFile(Path.resolve("debug.txt"), { encoding: "utf-8" });
  const syntaxNode = parse(input);
  //console.log(util.inspect(syntaxNode, { depth: 30 }));
  const symbolNode = analyze(syntaxNode);
  const json = emit(symbolNode);
  console.log(json);
}
main()
.catch(err => { console.error(err); });
