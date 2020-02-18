const Router = require('koa-router');
const router = new Router({ prefix: '/users' });

const {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login
} = require('../controllers/users');

router.get('/', getUser);

router.post('/', createUser);

router.get('/:id', getUserById);

router.patch('/:id', updateUser); //partly update

router.delete('/:id', deleteUser);

router.post('/login', login);

module.exports = router;
