// const jsonwebtoken = require('jsonwebtoken');
const jwt = require('koa-jwt');
const { secret } = require('../config');
const Router = require('koa-router');
const router = new Router({ prefix: '/users' });

const {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  checkOwner,
  listFollowing,
  listFollowers,
  follow,
  unfollow,
  checkUserExist,
  followTopics,
  unfollowTopics,
  listFollowingTopics,
  listQuestions,
  listLikingAnswers,
  likeAnswer,
  unlikeAnswer,
  listDislikingAnswers,
  dislikeAnswer,
  undislikeAnswer,
} = require('../controllers/users');

const { checkTopicExist } = require('../controllers/topics');
const { checkAnswerExist } = require('../controllers/answers');

/*自写middleware
const auth = async (ctx, next) => {
  const { authorization = '' } = ctx.request.header; //短路语法，如果authorization为空则赋值空字符串
  const token = authorization.replace('Bearer ', ''); //替换从请求头接收的authorization字符串里的‘Bearer ’为空
  try {
    const user = jsonwebtoken.verify(token, secret);
    ctx.state.user = user; //ctx.state通常都从来放用户信息
  } catch (err) {
    ctx.throw(401, err.message);
  }
  await next();
};*/

const auth = jwt({ secret });

router.get('/', getUser);

router.post('/', createUser);

router.get('/:id', getUserById);

router.patch('/:id', auth, checkOwner, updateUser); //partly update

router.delete('/:id', auth, checkOwner, deleteUser);

router.post('/login', login);

router.get('/:id/following', listFollowing);

router.get('/:id/followers', listFollowers);

router.put('/following/:id', auth, checkUserExist, follow);

router.delete('/following/:id', auth, checkUserExist, unfollow);

router.get('/:id/followingTopics', listFollowingTopics);

router.put('/followingTopics/:id', auth, checkTopicExist, followTopics);

router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopics);

router.get('/:id/questions', listQuestions);

router.get('/:id/likingAnswers', listLikingAnswers);

router.put(
  '/likingAnswers/:id',
  auth,
  checkAnswerExist,
  likeAnswer,
  undislikeAnswer
);

router.delete('/likingAnswers/:id', auth, checkAnswerExist, unlikeAnswer);

router.get('/:id/dislikingAnswers', listDislikingAnswers);

router.put(
  '/dislikingAnswers/:id',
  auth,
  checkAnswerExist,
  dislikeAnswer,
  unlikeAnswer
);

router.delete('/dislikingAnswers/:id', auth, checkAnswerExist, undislikeAnswer);

module.exports = router;
