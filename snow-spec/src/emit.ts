import util from "node:util";
import * as Src from "./irNode";
import * as Dest from "./openapiNode";

// このモジュールではIRツリーからOASファイルのJSONデータを生成します。

export function emit(file: Src.FileNode): string {
  const outFile: Dest.OpenAPI = {
    openapi: "3.1.1",
    info: {
      title: "",
      version: ""
    },
  };

  for (const fileMember of file.routes) {
    if (outFile.paths == null) {
      outFile.paths = {};
    }
    emitRoute(fileMember, outFile.paths);
  }

  for (const [componentName, component] of file.components) {
    if (outFile.components == null) {
      outFile.components = {};
    }
    for (const kind of component.blockKind) {
      if (kind == "parameter") {
        if (outFile.components.parameters == null) {
          outFile.components.parameters = {};
        }
        outFile.components.parameters[componentName] = {};
      }
      if (kind == "header") {
        if (outFile.components.headers == null) {
          outFile.components.headers = {};
        }
        outFile.components.headers[componentName] = {};
      }
      if (kind == "requestBody") {
        if (outFile.components.requestBodies == null) {
          outFile.components.requestBodies = {};
        }
        outFile.components.requestBodies[componentName] = {};
      }
      if (kind == "response") {
        if (outFile.components.responses == null) {
          outFile.components.responses = {};
        }
        outFile.components.responses[componentName] = {};
      }
    }
  }

  console.log(util.inspect(outFile, { depth: 30 }));

  const json = JSON.stringify(outFile);

  return json;
}

function emitRoute(node: Src.RouteNode, target: Record<string, Dest.PathItemObject>): void {
  const path = node.path;
  for (const endpoint of node.endpoints) {
    if (target[path] == null) {
      target[path] = { };
    }
    if (endpoint.method == "GET") {
      if (target[path]!.get == null) {
        target[path]!.get = {};
      }
    }
    if (endpoint.method == "POST") {
      if (target[path]!.post == null) {
        target[path]!.post = {};
      }
    }
    if (endpoint.method == "PUT") {
      if (target[path]!.put == null) {
        target[path]!.put = {};
      }
    }
    if (endpoint.method == "PATCH") {
      if (target[path]!.patch == null) {
        target[path]!.patch = {};
      }
    }
    if (endpoint.method == "DELETE") {
      if (target[path]!.delete == null) {
        target[path]!.delete = {};
      }
    }
  }
}
