const Router = require('koa-router');
const router = new Router({ prefix: '/users' });
const {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

router.get('/', getUser);

router.post('/', createUser);

router.get('/:id', getUserById);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
