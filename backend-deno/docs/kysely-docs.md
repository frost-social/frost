翻訳

## `ColumnType<SelectType, InsertType, UpdateType>`
この型は、select、insert、update操作に異なる型を指定するために使用できます。

Generated型も参照してください。

### Examples

次の例では、insertおよびupdateでオプションとなるnumberカラムを定義します。
updateではすべての列は常にオプションであるため、update型に `undefined` を指定する必要はありません。
以下の型は、識別子のようなあらゆる種類のデータベース生成列に役立ちます。
`Generated` 型は、実際にはこの例の型の単なるショートカットです。

```ts
type GeneratedNumber = ColumnType<number, number | undefined, number>
```

上記の例では、insertとupdateでカラムがオプションになっていますが、カラムを与えるかどうかは選択できます。
insert/updateを防止したい場合は、型を `never` に設定できます。

```ts
type ReadonlyNumber = ColumnType<number, never, never>
```

以下に、操作ごとに型が異なるもう1つの例を示します:

```ts
type UnupdateableDate = ColumnType<Date, string, never>
```

## `Generated<S>`
自動生成のカラムを定義するためのショートカットです。
カラムの型はすべてのselect、insert、updateで同じですが、insertとupdateではカラムはオプションです。

updateは常にオプションであるため、update型は `S | undefined` ではなく `S` です。
したがって、オプションを指定する必要はありません。

## `GeneratedAlways<S>`
データベースによってのみ生成される列を定義するためのショートカット (postgresの GENERATED ALWAYS AS IDENTITY など)。
insert/updateは許可されません。

## `JSONColumnType<SelectType, InsertType, UpdateType>`
JSON列を定義するためのショートカット。デフォルトでは文字列化されたJSON文字列としてinsert/updateされます。
