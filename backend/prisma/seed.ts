import { PrismaClient } from "@prisma/client";
import type { RequestContext } from "../src/core/restApi.js";
import { mapUserObject } from "../src/models/UserModel.js";
import { createToken } from "../src/services/TokenService.js";

async function main() {
  const db = new PrismaClient();

  try {
    // create internal user
    const rootUser = await prepareUser("internal");

    const ctx: RequestContext = {
      user: rootUser,
      db: db,
    };

    async function prepareUser(userName: string) {
      let row = await db.user.findFirst({
        where: {
          name: userName,
        },
      });
      if (row == null) {
        row = await db.user.create({
          data: {
            name: userName,
            display_name: userName,
            password_auth_enabled: false,
          },
        });
        console.log(`User '${userName}' has been created.`);
      }
      return mapUserObject(row);
    }

    // create public user
    const publicUser = await prepareUser("public");

    // create token for public
    const tokenRow = await db.token.findFirst({
      where: {
        user_id: publicUser.userId,
        token_kind: "access_token",
      },
    });
    if (tokenRow == null) {
      await createToken(ctx, {
        userId: publicUser.userId,
        tokenKind: "access_token",
        scopes: ["user.auth"],
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    await db.$disconnect();
  }
}
main();
