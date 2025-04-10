import * as Target from "./openapiNode";
import * as Symbols from "./symbolNode";

export function generate(file: Symbols.FileSymbol): string {
  const outFile: Target.OpenAPI = {
    openapi: "3.1.1",
    info: {
      title: "",
      version: ""
    },
    paths: {},
  };

  for (const fileMember of file.children) {
    if (fileMember.kind == "route") {
      for (const endpoint of fileMember.children) {
        if (outFile.paths![endpoint.syntaxNode.path] == null) {
          outFile.paths![endpoint.syntaxNode.path] = {};
        }
      }
    }
    if (fileMember.kind == "component" && fileMember.syntaxNode.component != null) {

    }
  }

  //console.log(util.inspect(outFile, { depth: 30 }));

  const json = JSON.stringify(outFile);

  return json;
}
