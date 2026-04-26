CREATE TABLE users (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    score INTEGER NOT NULL DEFAULT 0,
    total_predictions INTEGER NOT NULL DEFAULT 0,
    correct_predictions INTEGER NOT NULL DEFAULT 0,
    wrong_predictions INTEGER NOT NULL DEFAULT 0,
    accuracy_percentage DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    category VARCHAR(100) NOT NULL,
    prediction_question VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL,
    outcome VARCHAR(20),
    closing_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE votes (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES users(id),
    event_id BIGINT NOT NULL REFERENCES events(id),
    vote_option VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    was_correct BOOLEAN,
    CONSTRAINT uq_vote_user_event UNIQUE (user_id, event_id)
);

CREATE INDEX idx_votes_event_id ON votes(event_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);
