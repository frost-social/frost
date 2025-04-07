export type SNode = SFile | SAttr | SRoute | SHeader | SQuery | SBody | SField | SResponse | SRefType | SObjectType | SNumberValue | SBoolValue | SStringValue | STypeDecl;
export type SFileMember = SRoute | STypeDecl;
export type SRouteMember = SHeader | SQuery | SBody | SResponse | STypeDecl;
export type SType = SRefType | SObjectType;
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
  type: SType | undefined,
  attrs: SAttr[],
};

export type SQuery = {
  kind: "query",
  items: SField[],
};

export type SBody = {
  kind: "body",
  items: SNode[],
  attrs: SAttr[],
};

export type SField = {
  kind: "field",
  name: string,
  type: SType | undefined,
  attrs: SAttr[],
};

export type SResponse = {
  kind: "response",
  statusCode: string,
  type: SType | undefined,
  attrs: SAttr[],
};

export type SRefType = {
  kind: "refType",
  name: string,
};

export type SObjectType = {
  kind: "objectType",
  children: SObjectField[],
};

export type SObjectField = {
  kind: "objectField",
  name: string,
  value: SType,
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

export type STypeDecl = {
  kind: "typeDecl",
  name: string,
  type: SType | undefined,
};
