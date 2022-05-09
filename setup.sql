CREATE DATABASE IF NOT EXISTS sample;
CREATE TABLE IF NOT EXISTS sample.users (
    user_id VARCHAR(36) PRIMARY KEY,
    user VARCHAR(20) NOT NULL,
    password VARCHAR(60) NOT NULL,
    creation_date DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sample.items (
    item_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    creation_date DATETIME DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES sample.users (user_id) ON DELETE CASCADE
);