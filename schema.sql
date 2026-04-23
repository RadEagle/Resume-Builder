-- connect to postgres
-- CREATE DATABASE resume_vault;

CREATE TABLE resume_profile (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE experience (
    id SERIAL PRIMARY KEY,
    profile_id INT NOT NULL,
    title TEXT,
    organization TEXT,
    location TEXT,
    kind TEXT NOT NULL CHECK (kind IN ('school', 'work', 'side_project')),
    start_date DATE NOT NULL,
    end_date DATE,
    CONSTRAINT fk_profile
    FOREIGN KEY (profile_id)
    REFERENCES resume_profile(id)
    ON DELETE CASCADE
);

CREATE TABLE experience_bullet (
    id SERIAL PRIMARY KEY,
    experience_id INT NOT NULL,
    body TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    CONSTRAINT fk_experience
    FOREIGN KEY (experience_id)
    REFERENCES experience(id)
    ON DELETE CASCADE
);

CREATE TABLE education_detail (
    experience_id INT PRIMARY KEY,
    gpa NUMERIC(4, 3) NULL,
    CONSTRAINT fk_experience
    FOREIGN KEY (experience_id)
    REFERENCES experience(id)
    ON DELETE CASCADE
);

CREATE TABLE education_course (
    id SERIAL PRIMARY KEY,
    experience_id INT NOT NULL,
    name TEXT NOT NULL,
    code TEXT,
    sort_order INT DEFAULT 0,
    CONSTRAINT fk_experience
    FOREIGN KEY (experience_id)
    REFERENCES experience(id)
    ON DELETE CASCADE
);

CREATE TABLE skill (
    id SERIAL PRIMARY KEY,
    profile_id INT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('technical', 'soft', 'interest')),
    name TEXT NOT NULL,
    CONSTRAINT fk_profile
    FOREIGN KEY (profile_id)
    REFERENCES resume_profile(id)
    ON DELETE CASCADE
);

CREATE INDEX idx_experience_profile_id ON experience (profile_id);
CREATE INDEX idx_experience_bullet_experience_id ON experience_bullet (experience_id);
CREATE INDEX idx_education_course_experience_id ON education_course (experience_id);
CREATE INDEX idx_skills_profile_id ON skills (profile_id);