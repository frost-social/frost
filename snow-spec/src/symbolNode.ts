import * as Syntax from "./syntaxNode";

export type SymbolNode = RouteSymbol | RequestSymbol | ResponseSymbol | ComponentBaseSymbol | ComponentSymbol;
export type FileMemberSymbol = RouteSymbol | ComponentBaseSymbol;
export type EndpointMemberSymbol = RequestSymbol | ResponseSymbol;
export type ComponentSymbol = SchemaComponentSymbol | ResponseComponentSymbol | ParameterComponentSymbol | RequestBodyComponentSymbol | HeaderComponentSymbol | PathItemComponentSymbol;

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

export interface ComponentBaseSymbol {
  kind: "componentBase";
  children: ComponentSymbol[];
  syntaxNode: Syntax.ComponentDeclNode;
}

export interface SchemaComponentSymbol {
  kind: "schemaComponent";
  parent: ComponentBaseSymbol;
  children: SymbolNode[];
}

export interface ResponseComponentSymbol {
  kind: "responseComponent";
  parent: ComponentBaseSymbol;
  children: SymbolNode[];
}

export interface ParameterComponentSymbol {
  kind: "parameterComponent";
  children: SymbolNode[];
}

export interface RequestBodyComponentSymbol {
  kind: "requestBodyComponent";
  children: SymbolNode[];
}

export interface HeaderComponentSymbol {
  kind: "headerComponent";
  children: SymbolNode[];
}

export interface PathItemComponentSymbol {
  kind: "pathItemComponent";
  children: SymbolNode[];
}
