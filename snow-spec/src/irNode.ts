export interface NodeBase {
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

export type ValueNode = NumberValueNode | BoolValueNode | StringValueNode;

export interface AttrNode extends NodeBase {
  kind: 'attr';
  key: string;
  value?: ValueNode;
}

export type ComponentNode = ObjectComponentNode;

export interface ComponentBlockNode extends NodeBase {
  kind: "componentBlock";
  blockKind: string;
  component: ComponentNode;
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

export type EndpointMemberNode = RequestNode | ResponseNode;

export interface EndpointNode extends NodeBase {
  kind: 'endpointDecl';
  method: string;
  children: EndpointMemberNode[];
  attrs: AttrNode[];
}

export interface ObjectFieldNode extends NodeBase {
  kind: "objectField";
  name: string;
  value: ComponentNode;
  attrs: AttrNode[];
}

export interface ObjectComponentNode extends NodeBase {
  kind: "object";
  fields: ObjectFieldNode[];
}

export interface RouteNode {
  path: string;
  endpoints: EndpointNode[];
}

export interface FileNode extends NodeBase {
  kind: 'file';
  routes: RouteNode[];
}
