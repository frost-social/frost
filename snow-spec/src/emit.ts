import * as Nodes from "./openapiNode";
import * as Symbols from "./symbolNode";

export function emit(file: Symbols.FileSymbol): string {
  const outFile: Nodes.OpenAPI = {
    openapi: "3.1.1",
    info: {
      title: "",
      version: ""
    },
    paths: {},
    components: {
      requestBodies: {},
    },
  };

  for (const fileMember of file.children) {
    if (fileMember.kind == "route") {
      emitRoute(fileMember, outFile);
    }
    if (fileMember.kind == "componentBase") {
      emitComponentBase(fileMember, outFile);
    }
  }

  //console.log(util.inspect(outFile, { depth: 30 }));

  const json = JSON.stringify(outFile);

  return json;
}

function emitRoute(symbol: Symbols.RouteSymbol, root: Nodes.OpenAPI): void {
  for (const endpoint of symbol.children) {
    if (root.paths![endpoint.syntaxNode.path] == null) {
      root.paths![endpoint.syntaxNode.path] = {};
    }
  }
}

function emitComponentBase(symbol: Symbols.ComponentBaseSymbol, root: Nodes.OpenAPI): void {
  for (const component of symbol.children) {
    if (component.kind == "requestBodyComponent") {
      root.components!.requestBodies![symbol.syntaxNode.name] = {};
    }
  }
}
