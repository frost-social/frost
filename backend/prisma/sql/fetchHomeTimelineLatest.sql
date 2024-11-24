-- @param {String} $1:userId
-- @param {Int} $2:limit

SELECT leaf.*

FROM "user_following" AS user_following

JOIN "leaf" AS leaf
  ON leaf.user_id = user_following.user_id_following

WHERE user_following.user_id_followed_by = CAST($1 AS UUID)
  AND leaf.leaf_kind = 'timeline'

ORDER BY leaf.created_at DESC, leaf.leaf_id DESC
LIMIT $2
;
