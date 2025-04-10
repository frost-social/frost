import fs from "node:fs/promises";
import Path from "node:path";
import { generate } from "./generate";
import { parse } from "./parse";
import { resolve } from "./resolve";
import * as Symbols from "./symbolNode";
import * as Syntax from "./syntaxNode";

async function main() {
  const input = await fs.readFile(Path.resolve("debug.txt"), { encoding: "utf-8" });
  const snowTree = parse(input);
  //console.log(util.inspect(snowTree, { depth: 30 }));
  const symbolTable = new Map<Syntax.SyntaxNode, Symbols.SymbolNode>();
  resolve(snowTree, symbolTable);
  const json = generate(snowTree, symbolTable);
  //console.log(json);
}
main()
.catch(err => { console.error(err); });
