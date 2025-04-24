// 構文ツリーを構成するノードを定義します。

import { SymbolObject } from "./symbol";

export type SyntaxNode = FileNode | AttrNode | EndpointDeclNode | ResponseNode | ComponentRefNode | ObjectNode | NumberValueNode | BoolValueNode | StringValueNode | ComponentDeclNode;
export type FileMemberNode = EndpointDeclNode | ComponentDeclNode;
export type RouteMemberNode = RequestNode | ResponseNode;
export type ComponentNode = ComponentRefNode | ObjectNode;
export type ValueNode = NumberValueNode | BoolValueNode | StringValueNode;

export interface NodeBase {
  symbol?: SymbolObject;
}

export interface FileNode extends NodeBase {
  kind: 'file';
  children: FileMemberNode[];
}

export interface AttrNode extends NodeBase {
  kind: 'attr';
  key: string;
  value?: ValueNode;
}

export interface EndpointDeclNode extends NodeBase {
  kind: 'endpointDecl';
  method: string;
  path: string;
  children: RouteMemberNode[];
  attrs: AttrNode[];
}

export interface RequestNode extends NodeBase {
  kind: "request";
  blocks: ComponentBlockNode[];
  attrs: AttrNode[];
}

export interface ResponseNode extends NodeBase {
  kind: "response";
  statusCode: string;
  blocks: ComponentBlockNode[];
  attrs: AttrNode[];
}

export interface ComponentBlockNode extends NodeBase {
  kind: "componentBlock";
  blockKind: string;
  component: ComponentNode;
  attrs: AttrNode[];
}

export interface ComponentRefNode extends NodeBase {
  kind: "componentRef";
  name: string;
}

export interface ObjectNode extends NodeBase {
  kind: "object";
  children: ObjectFieldNode[];
}

export interface ObjectFieldNode extends NodeBase {
  kind: "objectField";
  name: string;
  value: ComponentNode;
  attrs: AttrNode[];
}

export interface NumberValueNode extends NodeBase {
  kind: "numberValue";
  value: string;
}

export interface BoolValueNode extends NodeBase {
  kind: "boolValue";
  value: string;
}

export interface StringValueNode extends NodeBase {
  kind: "stringValue";
  value: string;
}

export interface ComponentDeclNode extends NodeBase {
  kind: "componentDecl";
  name: string;
  component?: ComponentNode;
}
