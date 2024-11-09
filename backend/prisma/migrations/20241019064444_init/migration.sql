-- CreateTable
CREATE TABLE "user" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(64) NOT NULL,
    "display_name" VARCHAR(64) NOT NULL DEFAULT 'frost user',
    "password_auth_enabled" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "password_verification" (
    "password_verification_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "algorithm" VARCHAR(16) NOT NULL,
    "salt" VARCHAR(32) NOT NULL,
    "iteration" INTEGER NOT NULL,
    "hash" VARCHAR(128) NOT NULL,

    CONSTRAINT "password_verification_pkey" PRIMARY KEY ("password_verification_id")
);

-- CreateTable
CREATE TABLE "token" (
    "token_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token_kind" VARCHAR(16) NOT NULL,
    "user_id" UUID NOT NULL,
    "token" VARCHAR(32) NOT NULL,
    "expires" TIMESTAMP(6),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "token_scope" (
    "token_scope_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token_id" UUID NOT NULL,
    "scope_name" VARCHAR(32) NOT NULL,

    CONSTRAINT "token_scope_pkey" PRIMARY KEY ("token_scope_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_name_unique" ON "user"("name");

-- AddForeignKey
ALTER TABLE "password_verification" ADD CONSTRAINT "password_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "token_scope" ADD CONSTRAINT "token_scope_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "token"("token_id") ON DELETE RESTRICT ON UPDATE RESTRICT;
