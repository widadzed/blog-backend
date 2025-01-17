const express = require('express');
const jwt = require('jsonwebtoken'); 
const { Post } = require('../models/post');
const router = express.Router();
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const parsedToken = token.split(" ")[1];
    jwt.verify(parsedToken, 'your_very_strong_secret_key', (err, decoded) => {
        if (err) {
            console.error('Token decoding error:', err);
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = decoded; 
        next();
    });
    
}

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username');
        res.json(posts);
      } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
      }
});

// Get a post by ID
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate('user', 'username');
        res.json(post);
    } catch (err) {
        res.json({ message: err });
    }
});

// Create a new post
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
    const { title, content, categories, tags  } = req.body;
    const file = req.file;
    const finalImg = file ? {
        data: file.buffer,
        contentType: file.mimetype,
      } : null;
   
    const post = new Post({
      title,
      content,
      categories,
      tags,
      user: req.user._id,
      image: finalImg ,
    });
    
  
    try {
      const savedPost = await post.save();
      res.json(savedPost);
    } catch (err) {
      res.json({ message: err });
    }
  });

// Delete a post by ID
router.delete('/:postId', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });
    
        if (post.user.toString() !== req.user._id) {
          return res.status(403).json({ message: 'Access denied' });
        }
    
        const removedPost = await Post.deleteOne({ _id: req.params.postId });
        res.json(removedPost);
      } catch (err) {
        res.json({ message: err });
      }
});
// Route to retrieve all images
router.get('/api/images', async (req, res) => {
    try {
      const images = await Image.find();
      res.status(200).json(images);
    } catch (err) {
      res.status(500).send(err);
    }
  });
// Update a post by ID
router.patch('/:postId', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.user.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedPost = await Post.updateOne(
            { _id: req.params.postId },
            { $set: { title: req.body.title, content: req.body.content } }
        );
        res.json(updatedPost);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;

