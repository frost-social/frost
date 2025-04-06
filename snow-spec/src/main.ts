import fs from "node:fs/promises";
import Path from "node:path";
import { Scanner, TokenKind } from "./scan";

async function main() {
  const input = await fs.readFile(Path.resolve("debug.txt"), { encoding: "utf-8" });
  const scan = new Scanner();
  scan.initialize(input);
  const tokens = [];
  while (true) {
    if (!scan.read()) {
      console.error(scan.error);
      break;
    }

    console.log({ kind: TokenKind[scan.token!.kind], value: scan.token?.value });
    if (scan.token!.kind == TokenKind.EOF) {
      break;
    }
  }
}
main()
.catch(err => { console.error(err); });
