import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'moodring.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    profileUrl TEXT,
    createdAt TEXT,
    lastLogin TEXT,
    profileViews INTEGER DEFAULT 0,
    status TEXT,
    mood TEXT,
    customCSS TEXT,
    customHTML TEXT,
    profileSong TEXT,
    about TEXT,
    interests TEXT
  );

  CREATE TABLE IF NOT EXISTS friends (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    friendId TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    createdAt TEXT,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (friendId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS topFriends (
    userId TEXT NOT NULL,
    friendId TEXT NOT NULL,
    position INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (friendId) REFERENCES users(id),
    PRIMARY KEY (userId, friendId)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    authorId TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt TEXT,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (authorId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    content TEXT NOT NULL,
    mood TEXT,
    createdAt TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_friends_users ON friends(userId, friendId);
  CREATE INDEX IF NOT EXISTS idx_comments_users ON comments(userId, authorId);
  CREATE INDEX IF NOT EXISTS idx_posts_users ON posts(userId);
`);

export default db;