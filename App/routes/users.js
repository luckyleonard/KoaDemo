const jsonwebtoken = require('jsonwebtoken');
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
  checkOwner
} = require('../controllers/users');

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
};

router.get('/', getUser);

router.post('/', createUser);

router.get('/:id', getUserById);

router.patch('/:id', auth, checkOwner, updateUser); //partly update

router.delete('/:id', auth, checkOwner, deleteUser);

router.post('/login', login);

module.exports = router;
