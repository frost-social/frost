import * as Nodes from "./syntaxNode";
import * as Symbols from "./symbolNode";

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

function analyzeComponent(node: Nodes.ComponentDeclNode, parentSymbol: Symbols.FileSymbol): void {
  // TODO
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
      path: node.path,
      children: [],
    } satisfies Symbols.RouteSymbol;
    parentSymbol.children.push(routeSymbol);
  }

  // endpointシンボルを作成
  const symbol: Symbols.EndpointSymbol = {
    kind: "endpoint",
    children: [],
    syntaxNode: node,
  };
  routeSymbol.children.push(symbol);

  for (const member of node.children) {
    if (member.kind == "request") {
      analyzeRequest(member, symbol);
    }
    if (member.kind == "response") {
      analyzeResponse(member, symbol);
    }
  }
}

function analyzeRequest(node: Nodes.RequestNode, parentSymbol: Symbols.EndpointSymbol): void {
  // TODO
}

function analyzeResponse(node: Nodes.ResponseNode, parentSymbol: Symbols.EndpointSymbol): void {
  // TODO
}
