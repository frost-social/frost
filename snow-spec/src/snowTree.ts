export type SNode = SFile | SAttr | SRoute | SHeader | SQuery | SBody | SField | SResponse | SComponentRef | SObjectType | SNumberValue | SBoolValue | SStringValue | SComponentDecl;
export type SFileMember = SRoute | SComponentDecl;
export type SRouteMember = SRequest | SResponse;
export type SComponent = SComponentRef | SObjectType;
export type SValue = SNumberValue | SBoolValue | SStringValue;

export type SFile = {
  kind: 'file',
  children: SFileMember[];
};

export type SAttr = {
  kind: 'attr',
  key: string,
  value: SValue | undefined,
};

export type SRoute = {
  kind: 'route',
  method: string,
  path: string,
  children: SRouteMember[],
  attrs: SAttr[],
};

export type SHeader = {
  kind: "header",
  name: string,
  component: SComponent | undefined,
  attrs: SAttr[],
};

export type SQuery = {
  kind: "query",
  items: SField[],
  attrs: SAttr[],
};

export type SBody = {
  kind: "body",
  items: SNode[],
  attrs: SAttr[],
};

export type SField = {
  kind: "field",
  name: string,
  component: SComponent | undefined,
  attrs: SAttr[],
};

export type SRequest = {
  kind: "request",
  blocks: SComponentBlock[],
  attrs: SAttr[],
};

export type SResponse = {
  kind: "response",
  statusCode: string,
  blocks: SComponentBlock[],
  attrs: SAttr[],
};

export type SComponentBlock = {
  kind: "componentBlock",
  blockKind: string,
  component: SComponent,
  attrs: SAttr[],
};

export type SComponentRef = {
  kind: "componentRef",
  name: string,
};

export type SObjectType = {
  kind: "objectType",
  children: SObjectField[],
};

export type SObjectField = {
  kind: "objectField",
  name: string,
  value: SComponent,
};

export type SNumberValue = {
  kind: "numberValue",
  value: string,
};

export type SBoolValue = {
  kind: "boolValue",
  value: string,
};

export type SStringValue = {
  kind: "stringValue",
  value: string,
};

export type SComponentDecl = {
  kind: "componentDecl",
  name: string,
  component: SComponent | undefined,
};
