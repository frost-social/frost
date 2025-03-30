import express from "express";
import { defineModule, startModuleEngine } from "./module";

export type HttpServer = {
  app: express.Application,
};

defineModule("httpSecurity", {
  required: ["httpServer"],
  async onRegister(ctx) {
    const http = ctx.get<HttpServer>("httpServer");

    http.app.disable("x-powered-by");

    http.app.use((req, res, next) => {
      res.setHeader("X-Frame-Options", "DENY");
      next();
    });
  },
});

defineModule("httpServer", {
  async onRegister(ctx) {
    const http: HttpServer = {
      app: express(),
    };
    ctx.set(http);
  },
  async onStart(ctx) {
    const http = ctx.get<HttpServer>("httpServer");
    http.app.listen(process.env.LISTEN_PORT);
  },
});
