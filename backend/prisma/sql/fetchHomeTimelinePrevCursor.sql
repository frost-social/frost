-- @param {String} $1:userId
-- @param {String} $2:cursor
-- @param {Int} $3:limit

SELECT leaf.*

FROM
  "user_following" AS user_following
  (SELECT x.leaf_id, x.created_at FROM "leaf" AS x WHERE x.leaf_id = CAST($2 AS UUID)) AS cur

JOIN "leaf" AS leaf
  ON leaf.user_id = user_following.user_id_following

WHERE user_following.user_id_followed_by = CAST($1 AS UUID)
  AND leaf.leaf_kind = 'timeline'
  -- カーソル値よりも古いリソースを取得
  -- 作成日時がカーソル側より前であるかで判定。作成日時が同じ場合はリーフIDがカーソル側より小さいかで判定。
  AND (
    leaf.created_at < cur.created_at
    OR (leaf.created_at = cur.created_at AND leaf.leaf_id < cur.leaf_id)
  )

ORDER BY leaf.created_at DESC, leaf.leaf_id DESC
LIMIT $3
;
