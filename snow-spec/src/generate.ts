import util from "node:util";
import * as Syntax from "./syntaxNode";
import * as O from "./openapiSchema";
import { SnowSymbol } from "./resolve";

export function generate(file: Syntax.FileNode, symbolTable: Map<Syntax.SyntaxNode, SnowSymbol>): string {
  const outFile: O.OpenAPI = {
    openapi: "3.1.1",
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
    if (fileMember.kind == "componentDecl" && fileMember.component != null) {

    }
  }

  //console.log(util.inspect(outFile, { depth: 30 }));

  const json = JSON.stringify(outFile);

  return json;
}
