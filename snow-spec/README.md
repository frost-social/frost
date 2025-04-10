# snow-spec
A language for describing API specs. This language generates OpenAPI specification files.

## 🚧 This project is a work in progress! 🚧
We are currently working on this project.

## Example of a spec file
```
component ErrorResponse = {
  [description "エラー内容"]
  error: {
    [description "エラーコード。エラーの内容を識別できる値。"]
    code: number,

    [description "エラーの説明文。"]
    message: string,
  },
};

[description "GETリクエストで指定されたメッセージを返します。"]
GET /echo {
  request {
    headers: {
      [description "認証情報"]
      Authorization: string,
    };

    query: {
      [description "返答するメッセージを設定。"]
      message: string,
    };
  }

  [description "リクエスト成功"]
  response 200 {
    headers: {};

    [format "json"]
    body: {
      [description "返答メッセージ。リクエストで設定したメッセージが返されます。"]
      message: string,
    };
  }

  [description "無効なリクエスト"]
  response 400 {
    headers: {};

    [format "json"]
    body: ErrorResponse;
  }
}

[description "POSTリクエストで指定されたメッセージを返します。"]
POST /echo {
  request {
    headers: {
      [description "認証情報"]
      Authorization: string,
    };

    [format "json"]
    body: {
      [description "返答するメッセージを設定。"]
      message: string,
    };
  }

  [description "リクエスト成功"]
  response 200 {
    headers: {};

    [format "json"]
    body: {
      [description "返答メッセージ。リクエストで設定したメッセージが返されます。"]
      message: string,
    };
  }

  [description "無効なリクエスト"]
  response 400 {
    headers: {};

    [format "json"]
    body: ErrorResponse;
  }
}
```
