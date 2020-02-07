const Koa = require('koa');
const app = new Koa();
const bodyparser = require('koa-bodyparser');
const routing = require('./routes');

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || err.statusCode || 500;
    ctx.body = {
      message: err.message //res a JSON object
    };
  }
});

app.use(bodyparser());

routing(app);

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
