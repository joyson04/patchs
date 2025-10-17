-- MySQL schema for vuln_demo
CREATE DATABASE IF NOT EXISTS vuln_demo;
USE vuln_demo;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  bio TEXT
);

-- Example user
INSERT INTO users (username, password, bio) VALUES ('alice', 'password123', 'Hi, I am Alice');
