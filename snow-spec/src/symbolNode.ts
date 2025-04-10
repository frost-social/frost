import * as Syntax from "./syntaxNode";

export type SymbolNode = RouteSymbol | RequestSymbol | ResponseSymbol | ComponentSymbol;

export type RouteMemberSymbol = RequestSymbol | ResponseSymbol;

// シンボルテーブルを構成するノードを定義します。

export interface RouteSymbol {
  kind: "route";
  children: RouteMemberSymbol[];
  declNode: Syntax.RouteNode;
}

export interface RequestSymbol {
  kind: "request";
  children: SymbolNode[];
}

export interface ResponseSymbol {
  kind: "response";
  children: SymbolNode[];
}

export interface ComponentSymbol {
  kind: "component";
  children: SymbolNode[];
  declNode: Syntax.ComponentDeclNode;
}
