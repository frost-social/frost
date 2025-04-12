import * as Syntax from "./syntaxNode";

// シンボルグラフを構成するノードを定義します。

export type SymbolNode = RouteSymbol | RequestSymbol | ResponseSymbol | ComponentBaseSymbol | ComponentSymbol;
export type FileMemberSymbol = RouteSymbol | ComponentBaseSymbol;
export type EndpointMemberSymbol = RequestSymbol | ResponseSymbol;
export type ComponentSymbol = SchemaComponentSymbol | ResponseComponentSymbol | ParameterComponentSymbol | RequestBodyComponentSymbol | HeaderComponentSymbol | PathItemComponentSymbol;

export interface FileSymbol {
  kind: "file";
  children: FileMemberSymbol[];
  syntaxNode: Syntax.FileNode;
}

export interface RouteSymbol {
  kind: "route";
  parent: FileSymbol;
  path: string;
  children: EndpointSymbol[];
}

export interface EndpointSymbol {
  kind: "endpoint";
  parent: RouteSymbol;
  children: EndpointMemberSymbol[];
  syntaxNode: Syntax.EndpointDeclNode;
}

export interface RequestSymbol {
  kind: "request";
  parent: EndpointSymbol;
  children: SymbolNode[];
}

export interface ResponseSymbol {
  kind: "response";
  parent: EndpointSymbol;
  children: SymbolNode[];
}

export interface ComponentBaseSymbol {
  kind: "componentBase";
  parent: FileSymbol;
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
  parent: SymbolNode;
  children: SymbolNode[];
}

export interface RequestBodyComponentSymbol {
  kind: "requestBodyComponent";
  parent: SymbolNode;
  children: SymbolNode[];
}

export interface HeaderComponentSymbol {
  kind: "headerComponent";
  parent: SymbolNode;
  children: SymbolNode[];
}

export interface PathItemComponentSymbol {
  kind: "pathItemComponent";
  parent: SymbolNode;
  children: SymbolNode[];
}
