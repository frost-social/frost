import { createContainer, createSymbol, SymbolObject } from "./symbol";
import * as Nodes from "./syntaxNode";

// このモジュールでは構文ツリーの各ノードに対してシンボルを付加し、各ノード間の関係性を明確にします。
// シンボルは構文ノードに追加情報を与えることができます。

// NOTE:
// OpenAPIにおけるコンポーネントの種類を決定する必要がある(参照が複数ある場合はそれぞれ別の種類に分類される可能性あり)。

function resolveRequest(node: Nodes.RequestNode, parentSymbol: SymbolObject, symbolTable: Map<string, SymbolObject>): void {
  // TODO
}

function resolveResponse(node: Nodes.ResponseNode, parentSymbol: SymbolObject, symbolTable: Map<string, SymbolObject>): void {
  // TODO
}

function resolveComponent(node: Nodes.ComponentDeclNode, parentSymbol: SymbolObject, symbolTable: Map<string, SymbolObject>): void {
  if (node.component != null) {
    if (node.component.kind == "object") {
      createSymbol(node.component, node);
      //node.component.children;
    }
    if (node.component.kind == "componentRef") {
      const declSymbol = symbolTable.get(node.name);
      if (declSymbol != null) {
        node.component.symbol = declSymbol;
      }

      //node.component.name;
    }
  }
}

function resolveEndpoint(node: Nodes.EndpointDeclNode, parentSymbol: SymbolObject, symbolTable: Map<string, SymbolObject>): void {
  // routeシンボルを探す
  let routeSymbol;
  for (const member of parentSymbol.children) {
    if (member.kind == "route" && member.path == node.path) {
      routeSymbol = member;
      break;
    }
  }

  // routeシンボルが見つからなければ作成
  if (routeSymbol == null) {
    routeSymbol = {
      kind: "route",
      parent: parentSymbol,
      path: node.path,
      children: [],
    } satisfies SymbolObject;
    parentSymbol.children.push(routeSymbol);
  }

  // endpointシンボルを作成
  const endpointSymbol: Symbols.EndpointSymbol = {
    kind: "endpoint",
    parent: routeSymbol,
    children: [],
    syntaxNode: node,
  };
  routeSymbol.children.push(endpointSymbol);

  for (const member of node.children) {
    if (member.kind == "request") {
      resolveRequest(member, endpointSymbol, symbolTable);
    }
    if (member.kind == "response") {
      resolveResponse(member, endpointSymbol, symbolTable);
    }
  }
}

function resolveFile(node: Nodes.FileNode): void {
  const fileSymbol = createContainer(node, undefined);
  const symbolTable = fileSymbol.container!.symbolTable;

  // collect declarations
  for (const member of node.children) {
    if (member.kind == "componentDecl") {
      const declSymbol = createSymbol(member, fileSymbol.node);
      symbolTable.set(member.name, declSymbol);
    }
  }

  // analyze declarations
  for (const member of node.children) {
    if (member.kind == "componentDecl") {
      resolveComponent(member, fileSymbol, symbolTable);
    }
    if (member.kind == "endpointDecl") {
      resolveEndpoint(member, fileSymbol, symbolTable);
    }
  }
}

export function resolve(input: Nodes.FileNode): void {
  resolveFile(input);
}
