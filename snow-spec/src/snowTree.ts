export type N = NFile | NAttr | NRoute | NHeader | NQuery | NBody | NField | NResponse | NRefType | NObjectType | NNumberValue | NBoolValue | NStringValue | NTypeDecl;
export type NFileMember = NRoute | NTypeDecl;
export type NRouteMember = NHeader | NQuery | NBody | NResponse | NTypeDecl;
export type NType = NRefType | NObjectType;
export type NValue = NNumberValue | NBoolValue | NStringValue;

export type NFile = {
  kind: 'file',
  children: NFileMember[];
};

export type NAttr = {
  kind: 'attr',
  key: string,
  value: NValue | undefined,
};

export type NRoute = {
  kind: 'route',
  method: string,
  path: string,
  children: NRouteMember[],
  attrs: NAttr[],
};

export type NHeader = {
  kind: "header",
  name: string,
  type: NType | undefined,
  attrs: NAttr[],
};

export type NQuery = {
  kind: "query",
  items: NField[],
};

export type NBody = {
  kind: "body",
  items: N[],
  attrs: NAttr[],
};

export type NField = {
  kind: "field",
  name: string,
  type: NType | undefined,
  attrs: NAttr[],
};

export type NResponse = {
  kind: "response",
  statusCode: string,
  type: NType | undefined,
  attrs: NAttr[],
};

export type NRefType = {
  kind: "refType",
  name: string,
};

export type NObjectType = {
  kind: "objectType",
  children: NObjectField[],
};

export type NObjectField = {
  kind: "objectField",
  name: string,
  value: NType,
};

export type NNumberValue = {
  kind: "numberValue",
  value: string,
};

export type NBoolValue = {
  kind: "boolValue",
  value: string,
};

export type NStringValue = {
  kind: "stringValue",
  value: string,
};

export type NTypeDecl = {
  kind: "typeDecl",
  name: string,
  type: NType | undefined,
};
