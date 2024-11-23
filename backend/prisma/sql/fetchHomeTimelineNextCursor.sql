-- @param {String} $1:userId
-- @param {String} $2:cursor
-- @param {Int} $3:limit

SELECT leaf.*
FROM
  "leaf" AS leaf,
  (SELECT x.leaf_id, x.created_at FROM "leaf" AS x WHERE x.leaf_id = CAST($2 AS UUID)) AS cur
WHERE leaf.leaf_kind = 'timeline'
  AND CAST($1 AS UUID) = CAST($1 AS UUID)
  -- カーソル値よりも新しいリソースを取得
  -- 作成日時がカーソル側より後であるかで判定。作成日時が同じ場合はリーフIDがカーソル側より大きいかで判定。
  AND (
    leaf.created_at > cur.created_at
    OR (leaf.created_at = cur.created_at AND leaf.leaf_id > cur.leaf_id)
  )
ORDER BY leaf.created_at ASC, leaf.leaf_id ASC
LIMIT $3
;
