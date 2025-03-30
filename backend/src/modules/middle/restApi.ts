export interface ErrorObject {
  [x: string]: any,
  code: string,
  message: string,
  status: number,
}

export class RestError extends Error {
  constructor(
    public error: ErrorObject,
  ) {
    super(error.message);
  }
}

export class BadRequest implements ErrorObject {
  code = 'bad_request';
  message = 'The request is invalid.';
  status = 400;
  details?: { code?: string, path?: (string | number)[], message: string }[];

  constructor(
    details?: BadRequest["details"],
  ) {
    this.details = details;
  }
}

export class Unauthenticated implements ErrorObject {
  code = 'unauthenticated';
  message = 'Credentials are required for access.';
  status = 401;
}

export class AccessDenied implements ErrorObject {
  code = 'access_denied';
  message = 'You do not have access permissions.';
  status = 403;
}

export class ResourceNotFound implements ErrorObject {
  code = 'resource_not_found';
  message = 'The specified resource was not found.';
  status = 404;

  constructor(
    public resorceName: string,
  ) {}
}

export class EndpointNotFound implements ErrorObject {
  code = 'endpoint_not_found';
  message = 'The specified API endpoint was not found.';
  status = 404;
}

export class MethodNotAllowed implements ErrorObject {
  code = 'method_not_allowed';
  message = 'This API endpoint does not support the specified operation.';
  status = 405;
}

export class ServerError implements ErrorObject {
  code = 'server_error';
  message = 'An internal error occurred on the server.';
  status = 500;
}
