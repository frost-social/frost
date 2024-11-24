-- @param {String} $1:userId
-- @param {String} $2:cursor
-- @param {Int} $3:limit

SELECT leaf.*

FROM "leaf" AS leaf

JOIN "leaf" AS curLeaf
ON curLeaf.leaf_id = CAST($2 AS UUID)

WHERE
  leaf.leaf_kind = 'timeline'
  AND leaf.user_id IN (
    -- このユーザーがフォローしてる人
    SELECT user_following.user_id_following
    FROM "user_following" AS user_following
    WHERE user_following.user_id_followed_by = CAST($1 AS UUID)
    UNION ALL
    -- このユーザー自身
    SELECT CAST($1 AS UUID)
  )
  -- カーソル値よりも古いリソースを取得
  -- 作成日時がカーソル側より前であるかで判定。作成日時が同じ場合はリーフIDがカーソル側より小さいかで判定。
  AND (
    leaf.created_at < curLeaf.created_at
    OR (
      leaf.created_at = curLeaf.created_at
      AND leaf.leaf_id < curLeaf.leaf_id
    )
  )

ORDER BY leaf.created_at DESC, leaf.leaf_id DESC
LIMIT $3
;
