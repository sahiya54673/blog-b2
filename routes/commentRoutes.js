const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createComment);
router.get('/post/:postId', getCommentsByPost);
router.delete('/:id', protect, deleteComment);

module.exports = router;
