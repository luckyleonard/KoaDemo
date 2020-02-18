const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users');
const { secret } = require('../config');

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
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    });
    const { name } = ctx.request.body;
    const existedUser = await User.findOne({ name });
    if (existedUser) {
      ctx.throw(409, 'User name has been taken');
    } //verify unique user
    const user = await new User(ctx.request.body).save();
    ctx.body = user;
  }
  async updateUser(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false }
    });
    const { name } = ctx.request.body;
    const existedUser = await User.findOne({ name });
    if (existedUser) {
      ctx.throw(409, 'User name has been taken');
    } //verify unique user
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
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    });
    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, 'The username or password is incorrect');
    }
    const { _id, name } = user;
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' });
    ctx.body = { token };
  }
}

module.exports = new userCtl();
