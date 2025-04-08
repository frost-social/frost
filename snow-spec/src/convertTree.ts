import * as S from "./snowTree";
import * as M from "./middleTree";

export function convertTree(file: S.SFile): M.MFile {
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

  return outFile;
}
