-- AlterTable
ALTER TABLE "password_verification" ADD COLUMN     "row_version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "token" ADD COLUMN     "row_version" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "expires" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "token_scope" ADD COLUMN     "row_version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "row_version" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3);

-- CreateTable
CREATE TABLE "leaf" (
    "leaf_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "leaf_kind" VARCHAR(16) NOT NULL,
    "chat_room_id" UUID,
    "user_id" UUID NOT NULL,
    "content" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "row_version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "leaf_pkey" PRIMARY KEY ("leaf_id")
);

-- CreateTable
CREATE TABLE "user_following" (
    "user_id_followed_by" UUID NOT NULL,
    "user_id_following" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_following_pkey" PRIMARY KEY ("user_id_followed_by","user_id_following")
);

-- AddForeignKey
ALTER TABLE "leaf" ADD CONSTRAINT "leaf_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "user_following" ADD CONSTRAINT "user_following_user_id_followed_by_fkey" FOREIGN KEY ("user_id_followed_by") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "user_following" ADD CONSTRAINT "user_following_user_id_following_fkey" FOREIGN KEY ("user_id_following") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
