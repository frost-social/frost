import express from "express";

export function createHttpServer() {
  const app = express();

  app.disable("x-powered-by");

  app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    next();
  });

  return app;
}

export function listenHttpServer(app: express.Express, listenPort: number): Promise<void> {
  return new Promise<void>(resolve => {
    app.listen(listenPort, () => resolve());
  });
}
