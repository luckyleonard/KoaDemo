const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const userRouter = new Router({ prefix: '/users' });
const bodyparser = require('koa-bodyparser');

router.get('/', ctx => {
  ctx.body = 'this is homepage';
});

userRouter.get('/', ctx => {
  ctx.body = 'this is user list';
});

userRouter.post('/', ctx => {
  ctx.body = 'create a user';
});

userRouter.get('/:id', ctx => {
  ctx.body = `this user is ${ctx.params.id}`;
});

userRouter.put('/:id', ctx => {
  ctx.body = `this user is ${ctx.params.id}`;
});

userRouter.delete('/:id', ctx => {
  ctx.status = 204;
});

app.use(bodyparser());
app.use(router.routes());
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
