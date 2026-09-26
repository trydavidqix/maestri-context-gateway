-- Run as the Cloud SQL postgres operator after creating the hindsight login interactively.
-- No password, API key, credential, or provider value belongs in this file.
CREATE EXTENSION IF NOT EXISTS vector;
ALTER DATABASE hindsight OWNER TO hindsight;
GRANT CONNECT, TEMPORARY ON DATABASE hindsight TO hindsight;
