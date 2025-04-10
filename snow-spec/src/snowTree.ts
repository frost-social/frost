export type SyntaxNode = SFile | SAttr | SRoute | SResponse | SComponentRef | SObject | SNumberValue | SBoolValue | SStringValue | SComponentDecl;
export type SFileMember = SRoute | SComponentDecl;
export type SRouteMember = SRequest | SResponse;
export type SComponent = SComponentRef | SObject;
export type SValue = SNumberValue | SBoolValue | SStringValue;

export interface SFile {
  kind: 'file';
  children: SFileMember[];
}

export interface SAttr {
  kind: 'attr';
  key: string;
  value?: SValue;
};

export interface SRoute {
  kind: 'route';
  method: string;
  path: string;
  children: SRouteMember[];
  attrs: SAttr[];
};

export interface SRequest {
  kind: "request";
  blocks: SComponentBlock[];
  attrs: SAttr[];
};

export interface SResponse {
  kind: "response";
  statusCode: string;
  blocks: SComponentBlock[];
  attrs: SAttr[];
};

export interface SComponentBlock {
  kind: "componentBlock";
  blockKind: string;
  component: SComponent;
  attrs: SAttr[];
};

export interface SComponentRef {
  kind: "componentRef";
  name: string;
};

export interface SObject {
  kind: "object";
  children: SObjectField[];
};

export interface SObjectField {
  kind: "objectField";
  name: string;
  value: SComponent;
  attrs: SAttr[];
};

export interface SNumberValue {
  kind: "numberValue";
  value: string;
};

export interface SBoolValue {
  kind: "boolValue";
  value: string;
};

export interface SStringValue {
  kind: "stringValue";
  value: string;
};

export interface SComponentDecl {
  kind: "componentDecl";
  name: string;
  component?: SComponent;
};
