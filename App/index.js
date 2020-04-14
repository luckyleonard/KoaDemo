const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const error = require('koa-json-error');
const parameter = require('koa-parameter'); //check parameters format,provide verifyParams Method
const mongoose = require('mongoose');
const path = require('path');

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

app.use(koaStatic(path.join(__dirname, 'public')));
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }, //setting error format base on env
  })
);

app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'),
      keepExtensions: true,
    },
  })
);

app.use(parameter(app));

routing(app);

app.listen(4000, () => {
  console.log(`Server running at http://localhost:4000`);
});
