const jwt = require('koa-jwt');
const { secret } = require('../config');
const Router = require('koa-router');
const router = new Router({ prefix: '/questions/:questionId/answers' });

const {
  getAnswer,
  getAnswerById,
  createAnswer,
  checkAnswerExist,
  checkAnswerer,
  updateAnswer,
  deleteAnswer,
} = require('../controllers/answers');

const auth = jwt({ secret });

router.get('/', getAnswer);

router.post('/', auth, createAnswer);

router.get('/:id', checkAnswerExist, getAnswerById);

router.patch('/:id', auth, checkAnswerExist, checkAnswerer, updateAnswer);
//需鉴定是否是回答的人

router.delete('/:id', auth, checkAnswerExist, checkAnswerer, deleteAnswer);

// router.get('/:id/followers', checkTopicExist, listTopicFollowers);

// router.post('/login', login);

// router.get('/:id/following', listFollowing);

// router.put('/following/:id', auth, checkUserExist, follow);

// router.delete('/following/:id', auth, checkUserExist, unfollow);

module.exports = router;
