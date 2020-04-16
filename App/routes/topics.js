const jwt = require('koa-jwt');
const { secret } = require('../config');
const Router = require('koa-router');
const router = new Router({ prefix: '/topics' });

const {
  getTopic,
  getTopicById,
  createTopic,
  updateTopic,
} = require('../controllers/topics');

const auth = jwt({ secret });

router.get('/', getTopic);

router.post('/', auth, createTopic);

router.get('/:id', getTopicById);

router.patch('/:id', auth, updateTopic); //partly update

// router.delete('/:id', auth, checkOwner, deleteUser);

// router.post('/login', login);

// router.get('/:id/following', listFollowing);

// router.get('/:id/followers', listFollowers);

// router.put('/following/:id', auth, checkUserExist, follow);

// router.delete('/following/:id', auth, checkUserExist, unfollow);

module.exports = router;
