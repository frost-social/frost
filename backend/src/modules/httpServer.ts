import express from "express";
import { Container } from "inversify";
import { TYPES } from "../container/types";
import { RootRouter } from "../routes";
import { AppError, ErrorObject, ServerError } from "./appErrors";
import * as auth from "./httpRoute/authentication";

/**
 * 任意のエラー情報を元にREST APIのエラーを組み立てます。
*/
function buildRestApiError(err: unknown): { error: ErrorObject } {
  // app error
  if (err instanceof AppError) {
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

export async function createHttpServer(container: Container) {
  const rootRouter = container.get<RootRouter>(TYPES.RootRouter);

  const app = express();
  app.disable("x-powered-by");

  // security
  app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    next();
  });

  auth.configureServer(container);

  app.use(express.json());

  app.use(rootRouter.create());

  // @ts-ignore
  app.use((err, req, res, next) => {
    const errorResponse = buildRestApiError(err);
    res.status(errorResponse.error.status).json(errorResponse);
    return;
  });

  return app;
}
