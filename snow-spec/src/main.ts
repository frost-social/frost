import fs from "node:fs/promises";
import Path from "node:path";
import { parse } from "./parse";
import util from "node:util";
//import { convertTree } from "./convertTree";
//import { generate } from "./generate";

async function main() {
  const input = await fs.readFile(Path.resolve("debug.txt"), { encoding: "utf-8" });
  const snowTree = parse(input);
  console.log(util.inspect(snowTree, { depth: 10 }));
  //const middleTree = convertTree(snowTree);
  //console.log(util.inspect(middleTree, { depth: 10 }));
  //const openApiText = generate(middleTree);
  //console.log(openApiText);
}
main()
.catch(err => { console.error(err); });
