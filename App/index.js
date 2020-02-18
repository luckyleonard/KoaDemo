const Koa = require('koa');
const app = new Koa();
const bodyparser = require('koa-bodyparser');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const mongoose = require('mongoose');

const routing = require('./routes');
const { connectionStr } = require('./config');

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

mongoose.connect(
  connectionStr,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log('Connect to MongoDB Success');
  }
);
mongoose.connection.on('error', console.error);

app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest } //setting error format base on env
  })
);

app.use(bodyparser());

app.use(parameter(app));

routing(app);

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
