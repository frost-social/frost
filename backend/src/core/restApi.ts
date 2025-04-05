import express, { Express } from "express";
import { DB } from "./database";
import { ErrorObject, RestError, ServerError } from "./errors";
import { createApiRouter } from "../routers";

/**
 * 任意のエラー情報を元にREST APIのエラーを組み立てます。
*/
function buildRestApiError(err: unknown): { error: ErrorObject } {
  // app error
  if (err instanceof RestError) {
    return {
      error: err.error,
    };
  }

  // other errors
  console.error(err);
  return {
    error: new ServerError(),
  };
}

export function configure(db: DB, app: Express) {
  app.use(express.json());

  app.use(createApiRouter(db));

  // @ts-ignore
  app.use((err, req, res, next) => {
    const errorResponse = buildRestApiError(err);
    res.status(errorResponse.error.status).json(errorResponse);
    return;
  });
}

export function corsApi(): express.RequestHandler {
  return (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // preflight request
    if (req.method == 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'POST,GET,DELETE,OPTIONS');
      res.setHeader("Access-Control-Allow-Headers", "Accept,Content-Type,Origin,Authorization");
      res.setHeader("Access-Control-Max-Age", "60");
      return res.status(204).send();
    }

    next();
  };
}
