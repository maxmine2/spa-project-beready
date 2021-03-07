texts_table = """\
CREATE TABLE IF NOT EXISTS texts (
    id          INTEGER PRIMARY KEY,
    filesname   TEXT UNIQUE NOT NULL,
    text_title  TEXT NOT NULL
)"""

sessions_table = """\
CREATE TABLE IF NOT EXISTS sessions (
    session_id  TEXT PRIMARY KEY UNIQUE NOT NULL,
    start_date  DATE NOT NULL,
    logged_in   BOOLEAN NOT NULL
)"""