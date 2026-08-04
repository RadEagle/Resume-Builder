BEGIN;

ALTER TABLE users ADD COLUMN username TEXT;
UPDATE users SET username = LOWER(split_part(email, '@', 1)) WHERE username IS NULL;

-- Resolve duplicates: keep first id, suffix the rest
WITH duplicates AS (
    SELECT id, username, ROW_NUMBER() OVER(
        PARTITION BY username
        ORDER BY id ASC
    ) as row_num
    FROM users
)

UPDATE users
SET username = CONCAT(users.username, '_', users.id)
FROM duplicates
WHERE users.id = duplicates.id AND duplicates.row_num > 1;

ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);

COMMIT;