import * as Symbols from "./symbolNode";
import * as Nodes from "./syntaxNode";

// このモジュールでは構文ツリーからシンボルグラフを構築します。

// NOTE:
// OpenAPIにおけるコンポーネントの種類を決定する必要がある(参照が複数ある場合はそれぞれ別の種類に分類される可能性あり)。

export function analyze(input: Nodes.FileNode): Symbols.FileSymbol {
  const symbol: Symbols.FileSymbol = {
    kind: "file",
    children: [],
    syntaxNode: input,
  };

  for (const member of input.children) {
    if (member.kind == "componentDecl") {
      analyzeComponent(member, symbol);
    }
    if (member.kind == "endpointDecl") {
      analyzeEndpoint(member, symbol);
    }
  }

  return symbol;
}

function collectComponent() {

}

function analyzeComponent(node: Nodes.ComponentDeclNode, parentSymbol: Symbols.FileSymbol): void {
  const componentName = node.name;
  if (node.component == null) {
    return;
  }

  if (node.component.kind == "object") {
    //node.component.children;
  }
  if (node.component.kind == "componentRef") {
    //node.component.name;
  }
}

function analyzeEndpoint(node: Nodes.EndpointDeclNode, parentSymbol: Symbols.FileSymbol): void {
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
    } satisfies Symbols.RouteSymbol;
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
      analyzeRequest(member, endpointSymbol);
    }
    if (member.kind == "response") {
      analyzeResponse(member, endpointSymbol);
    }
  }
}

function analyzeRequest(node: Nodes.RequestNode, parentSymbol: Symbols.EndpointSymbol): void {
  // TODO
}

function analyzeResponse(node: Nodes.ResponseNode, parentSymbol: Symbols.EndpointSymbol): void {
  // TODO
}
