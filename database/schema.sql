-- FanEngage Sports Fan Platform Cloud
-- Database Schema (MySQL / RDS)
-- Case 133 | ITM Skills University

CREATE DATABASE IF NOT EXISTS fanengage_db;
USE fanengage_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('fan', 'manager', 'admin') DEFAULT 'fan',
  avatar VARCHAR(255) DEFAULT NULL,
  team_fav VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  sport VARCHAR(100) NOT NULL,
  venue VARCHAR(200) NOT NULL,
  event_date DATETIME NOT NULL,
  status ENUM('upcoming', 'live', 'completed', 'cancelled') DEFAULT 'upcoming',
  capacity INT DEFAULT 50000,
  tickets_sold INT DEFAULT 0,
  home_team VARCHAR(100),
  away_team VARCHAR(100),
  ticket_price DECIMAL(10, 2) DEFAULT 499.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('system', 'security', 'performance', 'event') DEFAULT 'system',
  message TEXT NOT NULL,
  severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  resolved BOOLEAN DEFAULT FALSE,
  source VARCHAR(100) DEFAULT 'CloudWatch',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Engagement records
CREATE TABLE IF NOT EXISTS engagement_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT,
  action ENUM('viewed', 'booked', 'shared', 'favourited') DEFAULT 'viewed',
  session_minutes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

-- Seed: Admin user (password: admin123)
INSERT IGNORE INTO users (name, email, password_hash, role)
VALUES ('Admin User', 'admin@fanengage.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LedT.PFJQ7WT7z1vy', 'admin');

-- Seed: Manager (password: manager123)
INSERT IGNORE INTO users (name, email, password_hash, role)
VALUES ('Event Manager', 'manager@fanengage.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uDa1HRTS2', 'manager');

-- Seed: Sample Events
INSERT IGNORE INTO events (title, sport, venue, event_date, status, capacity, tickets_sold, home_team, away_team, ticket_price)
VALUES
  ('IPL 2025 Final', 'Cricket', 'Wankhede Stadium, Mumbai', '2025-05-25 19:00:00', 'live', 35000, 32000, 'MI', 'CSK', 2500.00),
  ('ISL Semi-Final', 'Football', 'Salt Lake Stadium, Kolkata', '2025-06-10 17:30:00', 'upcoming', 68000, 65000, 'ATKMB', 'MCFC', 800.00),
  ('Pro Kabaddi League Final', 'Kabaddi', 'EKA Arena, Ahmedabad', '2025-06-20 20:00:00', 'upcoming', 10000, 8000, 'Gujarat Giants', 'Bengaluru Bulls', 499.00);

-- Seed: Sample Alerts
INSERT IGNORE INTO alerts (type, message, severity, resolved, source)
VALUES
  ('performance', 'EC2 CPU utilization exceeded 85% threshold.', 'high', false, 'CloudWatch'),
  ('security', 'Unusual login attempt detected. Blocked by IAM.', 'critical', false, 'AWS IAM'),
  ('system', 'RDS automated backup completed successfully.', 'low', true, 'AWS RDS');
