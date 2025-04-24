import util from "node:util";
import * as Nodes from "./openapiNode";
import * as Syntax from "./syntaxNode";

// このモジュールでは構文ツリーとシンボル情報からOASファイルのJSONデータを生成します。

export function emit(file: Syntax.FileNode): string {
  const outFile: Nodes.OpenAPI = {
    openapi: "3.1.1",
    info: {
      title: "",
      version: ""
    },
  };

  for (const fileMember of file.children) {
    if (fileMember.kind == "route") {
      if (outFile.paths == null) {
        outFile.paths = {};
      }
      emitRoute(fileMember, outFile.paths);
    }
    if (fileMember.kind == "componentBase") {
      if (outFile.components == null) {
        outFile.components = {};
      }
      emitComponentBase(fileMember, outFile.components);
    }
  }

  console.log(util.inspect(outFile, { depth: 30 }));

  const json = JSON.stringify(outFile);

  return json;
}

function emitRoute(node: Syntax.SyntaxNode, target: Record<string, Nodes.PathItemObject>): void {
  for (const endpoint of node.children) {
    if (target[endpoint.syntaxNode.path] == null) {
      target[endpoint.syntaxNode.path] = { };
    }
    if (endpoint.syntaxNode.method == "GET") {
      if (target[endpoint.syntaxNode.path]!.get == null) {
        target[endpoint.syntaxNode.path]!.get = {};
      }
    }
    if (endpoint.syntaxNode.method == "POST") {
      if (target[endpoint.syntaxNode.path]!.post == null) {
        target[endpoint.syntaxNode.path]!.post = {};
      }
    }
    if (endpoint.syntaxNode.method == "PUT") {
      if (target[endpoint.syntaxNode.path]!.put == null) {
        target[endpoint.syntaxNode.path]!.put = {};
      }
    }
    if (endpoint.syntaxNode.method == "PATCH") {
      if (target[endpoint.syntaxNode.path]!.patch == null) {
        target[endpoint.syntaxNode.path]!.patch = {};
      }
    }
    if (endpoint.syntaxNode.method == "DELETE") {
      if (target[endpoint.syntaxNode.path]!.delete == null) {
        target[endpoint.syntaxNode.path]!.delete = {};
      }
    }
  }
}

function emitComponentBase(symbol: Syntax.SyntaxNode, target: Nodes.ComponentsObject): void {
  for (const component of symbol.children) {
    if (component.kind == "parameterComponent") {
      if (target.parameters == null) {
        target.parameters = {};
      }
      target.parameters[symbol.syntaxNode.name] = {};
    }
    if (component.kind == "requestBodyComponent") {
      if (target.requestBodies == null) {
        target.requestBodies = {};
      }
      target.requestBodies[symbol.syntaxNode.name] = {};
    }
  }
}
