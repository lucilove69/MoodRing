import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from './database.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'moodring2025secretkey';

// Authentication middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;
    
    // Validation
    if (!email || !username || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if user exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?')
      .get(email, username);
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const id = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO users (
        id, username, email, password, firstName, lastName,
        profileUrl, createdAt, lastLogin, status, mood
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, username, email, hashedPassword, firstName, lastName,
      username, now, now, 'Just joined MoodRing!', 'Excited'
    );
    
    // Create JWT token
    const token = jwt.sign({ user: { id } }, JWT_SECRET, { expiresIn: '7d' });
    
    // Get user without password
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    delete user.password;
    
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    db.prepare('UPDATE users SET lastLogin = ? WHERE id = ?')
      .run(new Date().toISOString(), user.id);
    
    // Create JWT token
    const token = jwt.sign({ user: { id: user.id } }, JWT_SECRET, { expiresIn: '7d' });
    
    delete user.password;
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/user', auth, (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    delete user.password;
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/api/users/update', auth, (req, res) => {
  try {
    const updates = req.body;
    const { email, username, password, id, ...allowedUpdates } = updates;
    
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Build update query
    const fields = Object.keys(allowedUpdates)
      .map(key => `${key} = @${key}`)
      .join(', ');
    
    db.prepare(`UPDATE users SET ${fields} WHERE id = @userId`)
      .run({ ...allowedUpdates, userId: req.user.id });
    
    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?')
      .get(req.user.id);
    
    delete updatedUser.password;
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/users/profile/:username', (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?')
      .get(req.params.username);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    delete user.password;
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Track profile view
app.post('/api/users/view/:id', auth, (req, res) => {
  try {
    db.prepare('UPDATE users SET profileViews = profileViews + 1 WHERE id = ?')
      .run(req.params.id);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
app.post('/api/users/comment/:id', auth, (req, res) => {
  try {
    const { content, authorId } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    const comment = {
      id: uuidv4(),
      userId: req.params.id,
      authorId,
      content,
      createdAt: new Date().toISOString()
    };
    
    db.prepare(`
      INSERT INTO comments (id, userId, authorId, content, createdAt)
      VALUES (@id, @userId, @authorId, @content, @createdAt)
    `).run(comment);
    
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's friends
app.get('/api/users/friends/:id', (req, res) => {
  try {
    const friends = db.prepare(`
      SELECT u.* FROM users u
      INNER JOIN friends f ON (f.friendId = u.id OR f.userId = u.id)
      WHERE (f.userId = ? OR f.friendId = ?)
      AND f.status = 'accepted'
      AND u.id != ?
    `).all(req.params.id, req.params.id, req.params.id);
    
    friends.forEach(friend => delete friend.password);
    res.json(friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
app.get('/api/users/search', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const users = db.prepare(`
      SELECT * FROM users
      WHERE username LIKE ?
      OR firstName LIKE ?
      OR lastName LIKE ?
      OR email LIKE ?
      LIMIT 20
    `).all(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    
    users.forEach(user => delete user.password);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});