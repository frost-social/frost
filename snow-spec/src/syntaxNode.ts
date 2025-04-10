export type SyntaxNode = FileNode | AttrNode | RouteNode | ResponseNode | ComponentRefNode | ObjectNode | NumberValueNode | BoolValueNode | StringValueNode | ComponentDeclNode;
export type FileMemberNode = RouteNode | ComponentDeclNode;
export type RouteMemberNode = RequestNode | ResponseNode;
export type ComponentNode = ComponentRefNode | ObjectNode;
export type ValueNode = NumberValueNode | BoolValueNode | StringValueNode;

// 構文ツリーを構成するノードを定義します。

export interface FileNode {
  kind: 'file';
  children: FileMemberNode[];
}

export interface AttrNode {
  kind: 'attr';
  key: string;
  value?: ValueNode;
};

export interface RouteNode {
  kind: 'route';
  method: string;
  path: string;
  children: RouteMemberNode[];
  attrs: AttrNode[];
};

export interface RequestNode {
  kind: "request";
  blocks: ComponentBlockNode[];
  attrs: AttrNode[];
};

export interface ResponseNode {
  kind: "response";
  statusCode: string;
  blocks: ComponentBlockNode[];
  attrs: AttrNode[];
};

export interface ComponentBlockNode {
  kind: "componentBlock";
  blockKind: string;
  component: ComponentNode;
  attrs: AttrNode[];
};

export interface ComponentRefNode {
  kind: "componentRef";
  name: string;
};

export interface ObjectNode {
  kind: "object";
  children: ObjectFieldNode[];
};

export interface ObjectFieldNode {
  kind: "objectField";
  name: string;
  value: ComponentNode;
  attrs: AttrNode[];
};

export interface NumberValueNode {
  kind: "numberValue";
  value: string;
};

export interface BoolValueNode {
  kind: "boolValue";
  value: string;
};

export interface StringValueNode {
  kind: "stringValue";
  value: string;
};

export interface ComponentDeclNode {
  kind: "componentDecl";
  name: string;
  component?: ComponentNode;
};
