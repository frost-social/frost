-- @param {String} $1:token

SELECT
  token.user_id,
  token.token_kind,
  array_agg(scope.scope_name) AS scopes
FROM "token" AS token
LEFT JOIN "token_scope" AS scope
  ON scope.token_id = token.token_id
WHERE token.token = $1
GROUP BY token.token_id
