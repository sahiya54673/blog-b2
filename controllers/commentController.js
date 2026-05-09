const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Create a new comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res, next) => {
  try {
    const { text, postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comment = new Comment({
      text,
      post: postId,
      author: req.user._id,
    });

    const createdComment = await comment.save();
    res.status(201).json(createdComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
// @access  Public
const getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author', 'name email');
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment) {
      // Check if user is the author of the comment
      if (comment.author.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to delete this comment');
      }

      await comment.deleteOne();
      res.json({ message: 'Comment removed' });
    } else {
      res.status(404);
      throw new Error('Comment not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  deleteComment,
};
