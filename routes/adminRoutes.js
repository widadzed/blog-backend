const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');

const jwt = require('jsonwebtoken');


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, 'your_very_strong_secret_key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
}

const isAdmin = (req, res, next) => {
  const adminEmail = 'admin@gmail.com';
  if (req.user && req.user.email === adminEmail) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
};

// Get users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const removedUser = await User.findByIdAndDelete(req.params.id);
    res.json(removedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get posts
router.get('/posts', authenticateToken, isAdmin, async (req, res) => {
  try {
    const posts = await Post.find().populate('user');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete post
router.delete('/posts/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const removedPost = await Post.findByIdAndDelete(req.params.id);
    res.json(removedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

