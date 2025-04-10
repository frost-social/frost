import fs from "node:fs/promises";
import Path from "node:path";
import { generate } from "./generate";
import { parse } from "./parse";
import { analyze } from "./analyze";

async function main() {
  const input = await fs.readFile(Path.resolve("debug.txt"), { encoding: "utf-8" });
  const syntaxNode = parse(input);
  //console.log(util.inspect(snowTree, { depth: 30 }));
  const symbolNode = analyze(syntaxNode);
  const json = generate(symbolNode);
  //console.log(json);
}
main()
.catch(err => { console.error(err); });
