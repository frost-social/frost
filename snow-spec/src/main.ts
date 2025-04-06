import fs from "node:fs/promises";
import Path from "node:path";

async function main() {
  const input = await fs.readFile(Path.resolve("debug.txt"), { encoding: "utf-8" });

  console.log(input);
}
main()
.catch(err => { console.error(err); });
