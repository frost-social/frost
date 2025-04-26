import { createContainer, createSymbol, SymbolObject } from "./symbol";
import * as Nodes from "./syntaxNode";

// このモジュールでは構文ツリーの各ノードに対してシンボル情報を付加します。また、各ノード間の関係性を明確にします。
// シンボルは構文ノードに追加情報を与えることができます。

// NOTE:
// OpenAPIにおけるコンポーネントの種類を決定する必要がある(参照が複数ある場合はそれぞれ別の種類に分類される可能性あり)。

function resolveRequest(node: Nodes.RequestNode, parentNode: Nodes.AnyNode, symbolTable: Map<string, SymbolObject>): void {
  // TODO
}

function resolveResponse(node: Nodes.ResponseNode, parentNode: Nodes.AnyNode, symbolTable: Map<string, SymbolObject>): void {
  // TODO
}

function resolveComponent(node: Nodes.ComponentNode, parentNode: Nodes.AnyNode, symbolTable: Map<string, SymbolObject>): void {
  if (node.kind == "object") {
    createSymbol(node, parentNode);
    for (const fieldNode of node.children) {
      resolveComponent(fieldNode.value, node, symbolTable);
    }
  }
  if (node.kind == "componentRef") {
    // lookup the symbol table
    const declSymbol = symbolTable.get(node.name);
    if (declSymbol != null) {
      node.symbol = declSymbol;
    }
  }
}

function resolveComponentDecl(node: Nodes.ComponentDeclNode, parentNode: Nodes.AnyNode, symbolTable: Map<string, SymbolObject>): void {
  createSymbol(node, parentNode);
  if (node.component != null) {
    resolveComponent(node.component, node, symbolTable);
  }
}

function resolveEndpointDecl(node: Nodes.EndpointDeclNode, parentNode: Nodes.AnyNode, symbolTable: Map<string, SymbolObject>): void {
  // // routeシンボルを探す
  // let routeSymbol;
  // for (const member of parentSymbol.children) {
  //   if (member.kind == "route" && member.path == node.path) {
  //     routeSymbol = member;
  //     break;
  //   }
  // }

  // // routeシンボルが見つからなければ作成
  // if (routeSymbol == null) {
  //   routeSymbol = {
  //     kind: "route",
  //     parent: parentSymbol,
  //     path: node.path,
  //     children: [],
  //   } satisfies SymbolObject;
  //   parentSymbol.children.push(routeSymbol);
  // }

  // // endpointシンボルを作成
  // const endpointSymbol: Symbols.EndpointSymbol = {
  //   kind: "endpoint",
  //   parent: routeSymbol,
  //   children: [],
  //   syntaxNode: node,
  // };
  // routeSymbol.children.push(endpointSymbol);

  // for (const member of node.children) {
  //   if (member.kind == "request") {
  //     resolveRequest(member, endpointSymbol, symbolTable);
  //   }
  //   if (member.kind == "response") {
  //     resolveResponse(member, endpointSymbol, symbolTable);
  //   }
  // }
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
      resolveComponentDecl(member, node, symbolTable);
    }
    if (member.kind == "endpointDecl") {
      resolveEndpointDecl(member, node, symbolTable);
    }
  }
}

export function resolve(input: Nodes.FileNode): void {
  resolveFile(input);
}
