const jwt = require('koa-jwt');
const { secret } = require('../config');
const Router = require('koa-router');
const router = new Router({ prefix: '/questions' });

const {
  getQuestion,
  getQuestionById,
  createQuestion,
  checkQuestionExist,
  updateQuestion,
  deleteQuestion,
  checkQuestioner,
} = require('../controllers/questions');

const auth = jwt({ secret });

router.get('/', getQuestion);

router.post('/', auth, createQuestion);

router.get('/:id', checkQuestionExist, getQuestionById);

router.patch('/:id', auth, checkQuestionExist, checkQuestioner, updateQuestion);
//需鉴定是否是questioner

router.delete(
  '/:id',
  auth,
  checkQuestionExist,
  checkQuestioner,
  deleteQuestion
);

// router.get('/:id/followers', checkTopicExist, listTopicFollowers);

// router.post('/login', login);

// router.get('/:id/following', listFollowing);

// router.put('/following/:id', auth, checkUserExist, follow);

// router.delete('/following/:id', auth, checkUserExist, unfollow);

module.exports = router;
