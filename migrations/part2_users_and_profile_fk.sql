BEGIN;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	email TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE resume_profile ADD COLUMN user_id INTEGER;

INSERT INTO users (email, password_hash) VALUES (
	'legacy@resume-vault.local',
	'$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31my'
);

UPDATE resume_profile
SET user_id = (SELECT id FROM users ORDER BY id LIMIT 1)
WHERE user_id IS NULL;

ALTER TABLE resume_profile ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE resume_profile
	ADD CONSTRAINT fk_resume_profile_user
	FOREIGN KEY (user_id)
	REFERENCES users(id)
	ON DELETE CASCADE;

CREATE INDEX idx_resume_profile_user_id ON resume_profile (user_id);

COMMIT;