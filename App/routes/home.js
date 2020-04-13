const Router = require('koa-router');
const router = new Router();
const { index, upload } = require('../controllers/home'); //解构取值

router.get('/', index);
router.post('/upload', upload);

module.exports = router;
