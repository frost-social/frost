import * as Target from "./openapiNode";
import * as Symbols from "./symbolNode";
import * as Syntax from "./syntaxNode";

export function generate(file: Syntax.FileNode, symbolTable: Map<Syntax.SyntaxNode, Symbols.SymbolNode>): string {
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
