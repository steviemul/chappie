CREATE TABLE IF NOT EXISTS vector_store_chappie (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    content text,
    metadata json,
    embedding vector(768)
);

CREATE INDEX ON vector_store_chappie USING HNSW (embedding vector_cosine_ops);