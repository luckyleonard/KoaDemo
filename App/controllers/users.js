const User = require('../models/users');

class userCtl {
  async getUser(ctx) {
    ctx.body = await User.find();
  }
  async getUserById(ctx) {
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, 'User is not defined');
    }
    ctx.body = user;
  }
  async createUser(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true }
    });
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }
  async updateUser(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true }
    });
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    if (!user) {
      ctx.throw(404, 'User is not defined');
    }
    ctx.body = user;
  }
  async deleteUser(ctx) {
    const user = await User.findByIdAndDelete(ctx.params.id);
    if (!user) {
      ctx.throw(404, 'User is not defined');
    }
    ctx.status = 204;
  }
}

module.exports = new userCtl();
