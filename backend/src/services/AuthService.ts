import { Container } from "inversify";
import { AccessContext } from "../modules/AccessContext";
import { appError, BadRequest, ResourceNotFound } from "../modules/appErrors";
import { AuthResultEntity } from "../modules/entities";
import * as UserRepository from "../repositories/UserRepository";
import * as PasswordVerificationService from "./PasswordVerificationService";
import * as TokenService from "./TokenService";

/**
 * ユーザーを登録します。
 * 登録に成功すると、そのユーザーのトークンと登録情報が返されます。
*/
export async function signup(
  params: { userName: string, displayName: string, password?: string },
  ctx: AccessContext,
  container: Container,
): Promise<AuthResultEntity> {
  if (params.userName.length < 5) {
    throw appError(new BadRequest([
      { message: 'name invalid.' },
    ]));
  }

  if (params.password == null) {
    throw appError({
      code: "authMethodRequired",
      message: "Authentication method required.",
      status: 400,
    });
  }

  const user = await UserRepository.create({
    userName: params.userName,
    displayName: params.displayName,
    passwordAuthEnabled: true,
  }, ctx, container);

  await PasswordVerificationService.create({
    userId: user.userId,
    password: params.password,
  }, ctx, container);

  const scopes = ["user.read", "user.write", "leaf.read", "leaf.write", "leaf.delete"];

  const accessToken = await TokenService.create({
    userId: user.userId,
    tokenKind: "access_token",
    scopes: scopes,
  }, ctx, container);

  const refreshToken = await TokenService.create({
    userId: user.userId,
    tokenKind: "refresh_token",
    scopes: scopes,
  }, ctx, container);

  return { accessToken, refreshToken, user };
}

/**
 * 指定された認証情報でユーザーを認証します。
 * 認証に成功すると、そのユーザーのトークンと登録情報が返されます。
*/
export async function signin(
  params: { userName: string, password?: string },
  ctx: AccessContext,
  container: Container,
): Promise<AuthResultEntity> {
  if (params.userName.length < 1) {
    throw appError(new BadRequest([
      { message: 'name invalid.' },
    ]));
  }

  const user = await UserRepository.get({
    userName: params.userName,
  }, ctx, container);

  if (user == null) {
    throw appError(new ResourceNotFound("User"));
  }

  if (user.passwordAuthEnabled) {
    if (params.password == null || params.password.length < 1) {
      throw appError(new BadRequest([
        { message: 'password invalid.' },
      ]));
    }
    const verification = await PasswordVerificationService.verifyPassword({
      userId: user.userId,
      password: params.password,
    }, ctx, container);
    if (!verification) {
      throw appError({
        code: "incorrectCredential",
        message: "The userName and/or password is incorrect.",
        status: 401,
      });
    }
    const scopes = ["user.read", "user.write", "leaf.read", "leaf.write", "leaf.delete"];
    const accessToken = await TokenService.create({
      userId: user.userId,
      tokenKind: "access_token",
      scopes: scopes,
    }, ctx, container);
    const refreshToken = await TokenService.create({
      userId: user.userId,
      tokenKind: "refresh_token",
      scopes: scopes,
    }, ctx, container);
    return { accessToken, refreshToken, user };
  }

  throw new Error("authentication method not exists: " + user.userId);
}
