import express from 'express';
import { ApiVer1Router } from './apiVer1';
import { DB } from '../modules/db';

export class RootRouter {
  private apiVer1Router: ApiVer1Router = new ApiVer1Router();

  constructor() {}

  public create(db: DB) {
    const router = express.Router();

    router.use('/api/v1', this.apiVer1Router.create(db));

    return router;
  }
}
