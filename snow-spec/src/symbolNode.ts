import * as Syntax from "./syntaxNode";

export type SymbolNode = RouteSymbol | RequestSymbol | ResponseSymbol | ComponentSymbol;
export type FileMemberSymbol = RouteSymbol | ComponentSymbol;
export type EndpointMemberSymbol = RequestSymbol | ResponseSymbol;

// シンボルグラフを構成するノードを定義します。

export interface FileSymbol {
  kind: "file";
  children: FileMemberSymbol[];
  syntaxNode: Syntax.FileNode;
}

export interface RouteSymbol {
  kind: "route";
  children: EndpointSymbol[];
}

export interface EndpointSymbol {
  kind: "endpoint";
  children: EndpointMemberSymbol[];
  syntaxNode: Syntax.EndpointDeclNode;
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
  syntaxNode: Syntax.ComponentDeclNode;
}
