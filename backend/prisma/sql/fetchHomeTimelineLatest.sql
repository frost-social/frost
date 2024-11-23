-- @param {String} $1:userId
-- @param {Int} $2:limit

SELECT leaf.*
FROM "leaf" AS leaf
WHERE leaf.leaf_kind = 'timeline'
  AND CAST($1 AS UUID) = CAST($1 AS UUID)
ORDER BY leaf.created_at DESC, leaf.leaf_id DESC
LIMIT $2
;
