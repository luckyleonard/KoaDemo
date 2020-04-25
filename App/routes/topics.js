const jwt = require('koa-jwt');
const { secret } = require('../config');
const Router = require('koa-router');
const router = new Router({ prefix: '/topics' });

const {
  getTopic,
  getTopicById,
  createTopic,
  updateTopic,
  checkTopicExist,
  listTopicFollowers,
  listQuestions,
} = require('../controllers/topics');

const auth = jwt({ secret });

router.get('/', getTopic);

router.post('/', auth, createTopic);

router.get('/:id', checkTopicExist, getTopicById);

router.patch('/:id', auth, checkTopicExist, updateTopic); //partly update

router.get('/:id/followers', checkTopicExist, listTopicFollowers);

router.get('/:id/questions', checkTopicExist, listQuestions);

// router.delete('/:id', auth, checkOwner, deleteUser);

// router.post('/login', login);

// router.get('/:id/following', listFollowing);

// router.put('/following/:id', auth, checkUserExist, follow);

// router.delete('/following/:id', auth, checkUserExist, unfollow);

module.exports = router;
