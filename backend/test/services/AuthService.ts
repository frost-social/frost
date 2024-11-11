import assert from "assert";
import { Container } from "inversify";
import * as UserRepository from "../../src/repositories/UserRepository";
import * as PasswordVerificationService from "../../src/services/PasswordVerificationService";
import * as TokenService from "../../src/services/TokenService";
import * as AuthService from "../../src/services/AuthService";
import { AppError } from "../../src/modules/appErrors";

jest.mock("../../src/repositories/UserRepository");
const UserRepositoryMock = UserRepository as jest.Mocked<typeof UserRepository>;

jest.mock("../../src/services/PasswordVerificationService");
const PasswordVerificationServiceMock = PasswordVerificationService as jest.Mocked<typeof PasswordVerificationService>;

jest.mock("../../src/services/TokenService");
const TokenServiceMock = TokenService as jest.Mocked<typeof TokenService>;

describe('signup', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('ユーザーを作成できる', async () => {
    UserRepositoryMock.create
      .mockResolvedValue({
        userId: '00000000-0000-0000-0000-000000000000',
        userName: 'frost123',
        displayName: 'frost 123',
        passwordAuthEnabled: true,
      });

    PasswordVerificationServiceMock.create.mockResolvedValue();

    TokenServiceMock.create.mockResolvedValue({
      token: 'abcd',
      scopes: ["user.read", "user.write", "leaf.read", "leaf.write", "leaf.delete"],
    });

    const result = await AuthService.signup({
      userName: 'frost123',
      password: 'strongpasswordhere',
      displayName: 'frost 123',
    }, { userId: '' }, new Container());

    assert.deepStrictEqual(result.accessToken, { token: 'abcd', scopes: ["user.read", "user.write", "leaf.read", "leaf.write", "leaf.delete"] });

    assert.deepStrictEqual(result.refreshToken, { token: 'abcd', scopes: ["user.read", "user.write", "leaf.read", "leaf.write", "leaf.delete"] });

    assert.deepStrictEqual(result.user, {
      userId: '00000000-0000-0000-0000-000000000000',
      userName: 'frost123',
      displayName: 'frost 123',
      passwordAuthEnabled: true,
    });
  });

  it('何も認証情報を与えなければユーザー作成に失敗する', async () => {
    let appError;
    try {
      const user = await AuthService.signup({
        userName: 'frost123',
        displayName: 'frost 123',
      }, { userId: '' }, new Container());
      console.log(user);
      assert.fail();
    } catch (err) {
      if (err instanceof AppError) {
        appError = err;
      } else {
        throw err;
      }
    }

    assert.deepStrictEqual(appError.error, {
      code: "authMethodRequired",
      message: "Authentication method required.",
      status: 400,
    });
  });
});
