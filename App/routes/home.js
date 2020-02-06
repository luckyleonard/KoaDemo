const Router = require('koa-router');
const router = new Router();

router.get('/', ctx => {
  ctx.body = 'this is homepage';
});

module.exports = router;