import { Container, inject, injectable } from 'inversify';
import z from 'zod';
import { TYPES } from '../container/types';
import { appError, EndpointNotFound } from '../modules/appErrors';
import { ApiRouteBuilder } from '../modules/httpRoute/ApiRouteBuilder';
import { corsApi } from '../modules/httpRoute/cors';
import type { Endpoints } from '../modules/httpRoute/endpoints';
import * as LeafService from '../services/LeafService';
import * as UserService from '../services/UserService';
import * as AuthService from '../services/AuthService';

const zUuid = z.string().length(36);

@injectable()
export class ApiVer1Router {
  constructor(
    @inject(TYPES.Container) private readonly container: Container,
  ) {}

  public create() {
    const builder = new ApiRouteBuilder(this.container);

    builder.router.use(corsApi());

    builder.register({
      method: 'POST',
      path: '/auth/signin',
      scope: 'user.auth',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/auth/signin']['result']> {
        const params: Endpoints['/api/v1/auth/signin']['body'] = ctx.validateParams(
          z.object({
            userName: z.string().min(1),
            password: z.string().min(1).optional(),
          })
        );
        const result = await AuthService.signin(params, { userId: ctx.getUser().userId }, ctx.container);
        return result;
      },
    });

    builder.register({
      method: 'POST',
      path: '/auth/signup',
      scope: 'user.auth',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/auth/signup']['result']> {
        const params: Endpoints['/api/v1/auth/signup']['body'] = ctx.validateParams(
          z.object({
            userName: z.string().min(1),
            password: z.string().min(1).optional(),
            displayName: z.string().min(1),
          })
        );
        const result = await AuthService.signup(params, { userId: ctx.getUser().userId }, ctx.container);
        return result;
      },
    });

    builder.register({
      method: 'GET',
      path: '/echo',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/echo']['get']['result']> {
        const params: Endpoints['/api/v1/echo']['get']['query'] = ctx.validateParams(
          z.object({
            message: z.string().min(1),
          })
        );
        return { message: params.message };
      },
    });

    builder.register({
      method: 'POST',
      path: '/echo',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/echo']['post']['result']> {
        const params: Endpoints['/api/v1/echo']['post']['body'] = ctx.validateParams(
          z.object({
            message: z.string().min(1),
          })
        );
        return { message: params.message };
      },
    });

    builder.register({
      method: 'POST',
      path: '/leaf/createLeaf',
      scope: 'leaf.write',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/leaf/createLeaf']['result']> {
        const params: Endpoints['/api/v1/leaf/createLeaf']['body'] = ctx.validateParams(
          z.object({
            content: z.string().min(1),
          })
        );
        const result = await LeafService.createLeaf(params, { userId: ctx.getUser().userId }, ctx.container);
        return result;
      },
    });

    builder.register({
      method: 'POST',
      path: '/leaf/deleteLeaf',
      scope: 'leaf.delete',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/leaf/deleteLeaf']['result']> {
        const params: Endpoints['/api/v1/leaf/deleteLeaf']['body'] = ctx.validateParams(
          z.object({
            leafId: zUuid,
          })
        );
        await LeafService.deleteLeaf(params, { userId: ctx.getUser().userId }, ctx.container);
      },
    });

    builder.register({
      method: 'GET',
      path: '/leaf/getLeaf',
      scope: 'leaf.read',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/leaf/getLeaf']['result']> {
        const params: Endpoints['/api/v1/leaf/getLeaf']['query'] = ctx.validateParams(
          z.object({
            leafId: zUuid,
          })
        );
        const result = await LeafService.getLeaf(params, { userId: ctx.getUser().userId }, ctx.container);
        return result;
      },
    });

    builder.register({
      method: 'GET',
      path: '/leaf/searchLeafs',
      scope: 'leaf.read',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/leaf/searchLeafs']['result']> {
        throw new Error('not implemented');
      },
    });

    builder.register({
      method: 'POST',
      path: '/user/deleteUser',
      scope: 'user.delete',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/leaf/deleteLeaf']['result']> {
        throw new Error('not implemented');
      },
    });

    builder.register({
      method: 'POST',
      path: '/user/followUser',
      scope: 'user.write',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/user/followUser']['result']> {
        throw new Error('not implemented');
      },
    });

    builder.register({
      method: 'GET',
      path: '/user/getFollowings',
      scope: 'user.read',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/user/getFollowings']['result']> {
        throw new Error('not implemented');
      },
    });

    builder.register({
      method: 'GET',
      path: '/user/getHomeTimeline',
      scope: ['user.read', 'leaf.read'],
      async requestHandler(ctx): Promise<Endpoints['/api/v1/user/getHomeTimeline']['result']> {
        const params: Endpoints['/api/v1/user/getHomeTimeline']['query'] = ctx.validateParams(
          z.object({
            nextCursor: z.string().length(36).optional(),
            prevCursor: z.string().length(36).optional(),
            limit: z.string().regex(/^[+-]?\d*\.?\d+$/, { message: 'invalid numeric string' }).optional(),
          })
        );
        const params2 = {
          kind: 'home',
          ...params,
          limit: Number(params.limit),
        };
        const result = await UserService.fetchHomeTimeline(params2, { userId: ctx.getUser().userId }, ctx.container);
        return result;
      },
    });

    builder.register({
      method: 'GET',
      path: '/user/getUser',
      scope: 'user.read',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/user/getUser']['result']> {
        const params: Endpoints['/api/v1/user/getUser']['query'] = ctx.validateParams(
          z.object({
            userId: zUuid.optional(),
            userName: z.string().min(1).optional(),
          })
        );
        const result = await UserService.getUser(params, { userId: ctx.getUser().userId }, ctx.container);
        return result;
      },
    });

    builder.register({
      method: 'GET',
      path: '/user/searchUsers',
      scope: 'user.read',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/user/searchUsers']['result']> {
        throw new Error('not implemented');
      },
    });

    builder.register({
      method: 'POST',
      path: '/user/unfollowUser',
      scope: 'user.write',
      async requestHandler(ctx): Promise<Endpoints['/api/v1/user/unfollowUser']['result']> {
        throw new Error('not implemented');
      },
    });

    builder.router.use((req, res, next) => {
      next(appError(new EndpointNotFound()));
    });

    return builder.router;
  }
}
