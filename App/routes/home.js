const Router = require('koa-router');
const router = new Router();
const { index } = require('../controllers/home'); //解构取值

router.get('/', index);

module.exports = router;
