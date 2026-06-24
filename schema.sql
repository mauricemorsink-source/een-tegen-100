CREATE TABLE IF NOT EXISTS questions (
  id            TEXT PRIMARY KEY,
  text          TEXT NOT NULL,
  answer_a      TEXT,
  answer_b      TEXT,
  answer_c      TEXT,
  correct_answer TEXT,
  category      TEXT,
  category2     TEXT,
  class_type    TEXT,
  difficulty    TEXT,
  starters      INTEGER,
  afvallers     INTEGER,
  dropout_pct   INTEGER,
  episode       TEXT,
  notes         TEXT,
  date_added    TIMESTAMPTZ DEFAULT NOW()
);
