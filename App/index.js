const Koa = require('koa');
const app = new Koa();
const bodyparser = require('koa-bodyparser');
const routing = require('./routes');
const error = require('koa-json-error');
const parameter = require('koa-parameter');

// app.use(async (ctx, next) => {
//   try {
//     await next();
//   } catch (err) {
//     ctx.status = err.status || err.statusCode || 500;
//     ctx.body = {
//       message: err.message //res a JSON object
//     };
//   }
// }); //error handler with own design

app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
  })
);

app.use(bodyparser());

app.use(parameter(app));

routing(app);

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
