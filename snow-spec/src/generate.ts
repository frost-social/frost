import util from "node:util";
import * as S from "./snowTree";
import * as M from "./openapiTree";

export function generate(file: S.SFile): string {
  const outFile: M.MFile = {
    openapi: "3.1.0",
    paths: {},
  };

  for (const fileMember of file.children) {
    if (fileMember.kind == "route") {
      if (outFile.paths[fileMember.path] == null) {
        outFile.paths[fileMember.path] = {};
      }
    }
  }

  console.log(util.inspect(outFile, { depth: 30 }));

  return JSON.stringify(outFile);
}
