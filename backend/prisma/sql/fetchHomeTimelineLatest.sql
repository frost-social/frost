-- @param {String} $1:userId
-- @param {Int} $2:limit

SELECT leaf.*

FROM "leaf" AS leaf

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

ORDER BY leaf.created_at DESC, leaf.leaf_id DESC
LIMIT $2
;
