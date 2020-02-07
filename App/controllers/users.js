let db = [{ name: 'Leonard' }];

class userCtl {
  getUser(ctx) {
    ctx.body = db;
  }
  getUserById(ctx) {
    if (ctx.params.id * 1 >= db.length) {
      ctx.status(412, 'ID is out of range');
    }
    ctx.body = db[ctx.params.id * 1];
  }
  createUser(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true }
    });
    db.push(ctx.request.body);
    ctx.body = ctx.request.body;
  }
  updateUser(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true }
    });
    db[ctx.params.id * 1] = ctx.request.body;
    ctx.body = ctx.request.body;
  }
  deleteUser(ctx) {
    if (ctx.params.id * 1 >= db.length) {
      ctx.status(412, 'ID is out of range');
    }
    db.splice(ctx.params.id * 1, 1);
    ctx.status = 204;
  }
}

module.exports = new userCtl();
