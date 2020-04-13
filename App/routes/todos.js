const Router = require('koa-router');
const router = new Router({ prefix: '/todos' });

const { getTodos, deleteTodos, createTodos } = require('../controllers/todos');

router.get('/', getTodos);

router.delete('/:id', deleteTodos);

router.post('/', createTodos);

module.exports = router;
