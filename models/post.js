const mongoose = require('mongoose');
const User = require('./user');
const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});
const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
 
  image: {
    type: imageSchema,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const Post = mongoose.model('Post', PostSchema);
const Image = mongoose.model('Image', imageSchema);

module.exports = { Post, Image };
