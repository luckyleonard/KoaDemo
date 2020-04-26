const jwt = require('koa-jwt');
const { secret } = require('../config');
const Router = require('koa-router');
const router = new Router({
  prefix: '/questions/:questionId/answers/:answerId/comments',
});

const {
  getComment,
  getCommentById,
  createComment,
  checkCommentExist,
  checkCommentator,
  updateComment,
  deleteComment,
} = require('../controllers/comments');

const auth = jwt({ secret });

router.get('/', getComment);

router.post('/', auth, createComment);

router.get('/:id', checkCommentExist, getCommentById);

router.patch('/:id', auth, checkCommentExist, checkCommentator, updateComment);
//需鉴定是否是回答的人

router.delete('/:id', auth, checkCommentExist, checkCommentator, deleteComment);

module.exports = router;
