import util from "node:util";
import * as S from "./snowTree";
import * as O from "./openapiSchema";

export function generate(file: S.SFile): string {
  const outFile: O.OpenAPI = {
    openapi: "3.1.0",
    info: {
      title: "",
      version: ""
    },
    paths: {},
  };

  for (const fileMember of file.children) {
    if (fileMember.kind == "route") {
      if (outFile.paths![fileMember.path] == null) {
        outFile.paths![fileMember.path] = {};
      }
    }
  }

  console.log(util.inspect(outFile, { depth: 30 }));

  const json = JSON.stringify(outFile);
  //console.log(json);

  return json;
}
