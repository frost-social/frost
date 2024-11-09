-- @param {String} $1:userId
-- @param {String} $2:cursor
-- @param {Int} $3:limit

SELECT p.*
FROM
  "post" AS p,
  (SELECT x.post_id, x.created_at FROM post AS x WHERE x.post_id = CAST($2 AS UUID)) AS cur
WHERE p.post_kind = 'timeline'
  AND CAST($1 AS UUID) = CAST($1 AS UUID)
  -- カーソル値よりも新しいリソースを取得
  -- 作成日時がカーソル側より後であるかで判定。作成日時が同じ場合はリーフIDがカーソル側より大きいかで判定。
  AND (
    p.created_at > cur.created_at
    OR (p.created_at = cur.created_at AND p.post_id > cur.post_id)
  )
ORDER BY p.created_at ASC, p.post_id ASC
LIMIT $3
;
