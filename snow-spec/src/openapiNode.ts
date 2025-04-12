// OASファイルを構成するノードを定義します。

// https://spec.openapis.org/oas/v3.1.1.html#openapi-object
export interface OpenAPI {
  openapi: string;
  info: InfoObject;
  paths?: Record<string, PathItemObject>;
  components?: ComponentsObject;
}

// https://spec.openapis.org/oas/v3.1.1.html#info-object
export interface InfoObject {
  title: string;
  description?: string;
  version: string;
}

// https://spec.openapis.org/oas/v3.1.1.html#path-item-object
export interface PathItemObject {
  description?: string;
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  patch?: OperationObject;
}

// https://spec.openapis.org/oas/v3.1.1.html#operation-object
export interface OperationObject {
  description?: string;
  operationId?: string;
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  responses?: Record<HttpStatusCode, ResponseObject>;
}

export type HttpStatusCode = string;

// https://spec.openapis.org/oas/v3.1.1.html#parameter-object
export interface ParameterObject {
  name: string;
  in: string;
  description?: string;
  required?: boolean;
  allowEmptyValue?: boolean;
}

// https://spec.openapis.org/oas/v3.1.1.html#request-body-object
export interface RequestBodyObject {
  description?: string;
  content: Record<string, MediaTypeObject>;
  required?: boolean;
}

// https://spec.openapis.org/oas/v3.1.1.html#response-object
export interface ResponseObject {
  description?: string;
  headers?: Record<string, HeaderObject>;
  content?: Record<string, MediaTypeObject>;
}

// https://spec.openapis.org/oas/v3.1.1.html#header-object
export interface HeaderObject {
  description?: string;
  required?: boolean;
  allowEmptyValue?: boolean;
}

// https://spec.openapis.org/oas/v3.1.1.html#media-type-object
export interface MediaTypeObject {
  schema?: SchemaObject;
}

// https://spec.openapis.org/oas/v3.1.1.html#components-object
export interface ComponentsObject {
  schemas?: Record<string, SchemaObject>;
  responses?: Record<string, SchemaObject>;
  parameters?: Record<string, SchemaObject>;
  requestBodies?: Record<string, SchemaObject>;
  headers?: Record<string, SchemaObject>;
  pathItems?: Record<string, SchemaObject>;
}

// https://spec.openapis.org/oas/v3.1.1.html#schema-object
export interface SchemaObject {
  // TODO
}
