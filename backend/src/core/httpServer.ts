import express from "express";

export function configure() {
  const app = express();

  app.disable("x-powered-by");

  app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    next();
  });

  return app;
}
