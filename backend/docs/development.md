# データベース関係

## 開発環境のDBをセットアップする
1. 依存関係をインストール

   ※既に依存関係がインストールされていればこの操作は不要。
   ```
   pnpm i
   ```

2. DBを移行

   migrationsディレクトリにあるマイグレーションをDBに適用します。\
   ※この操作はスキーマの変更がある場合にはマイグレーションの生成も行うことに注意してください。
   ```
   pnpm run db:migrate
   ```

3. DB関連のコードを生成

   PrismaClientとTypedSQLのコードが生成されます。
   ```
   pnpm run db:generate
   ```

4. リビルド

   ※既にdist/prisma以下にあるスクリプトが最新になっていればこの操作は不要。一応やっておくほうが無難。
   ```
   pnpm run rebuild
   ```

5. DBに初期データを投入

   ```
   pnpm run db:seed
   ```

## 開発時にDBスキーマを変更したい
1. schema.prismaを変更 (変更者)

2. DBを移行 (変更者)
   ```
   pnpm run db:migrate
   ```

3. リポジトリにコミット (変更者)

4. マイグレーションを適用 (他のメンバー)

   他のメンバーのスキーマ変更をマイグレーションとして適用してください。
   ```
   pnpm run db:migrate
   ```

## リリース用のマイグレーションを作成する
リリース時は、開発時に作成されたマイグレーションを1つのマイグレーションにまとめます。

1. migrationsディレクトリの状態を前のリリースの状態まで戻す
2. マイグレーションを作成する
   ```
   pnpm run db:migrate
   ```

これでschema.prismaとmigrationsディレクトリの状態の差からスカッシュ・マイグレーションが作成されます。

参考: https://www.prisma.io/docs/orm/prisma-migrate/workflows/squashing-migrations
