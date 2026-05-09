const Post = require('../models/Post');

// @desc    Fetch all posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate('author', 'name email');
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single post
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');

    if (post) {
      res.json(post);
    } else {
      res.status(404);
      throw new Error('Post not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user._id,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const post = await Post.findById(req.params.id);

    if (post) {
      // Check if user is the author
      if (post.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to update this post');
      }

      post.title = title || post.title;
      post.content = content || post.content;

      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404);
      throw new Error('Post not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      // Check if user is the author
      if (post.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to delete this post');
      }

      await post.deleteOne();
      res.json({ message: 'Post removed' });
    } else {
      res.status(404);
      throw new Error('Post not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
