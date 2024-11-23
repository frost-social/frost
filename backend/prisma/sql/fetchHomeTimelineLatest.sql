-- @param {String} $1:userId
-- @param {Int} $2:limit

SELECT post.*
FROM "post" AS post
WHERE post.post_kind = 'timeline'
  AND CAST($1 AS UUID) = CAST($1 AS UUID)
ORDER BY post.created_at DESC, post.post_id DESC
LIMIT $2
;
