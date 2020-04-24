const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users');
const { secret } = require('../config');

class userCtl {
  async getUser(ctx) {
    const { per_page = 5 } = ctx.query; //获取分页默认参数
    const page = Math.max((ctx.query.page - 1) * 1, 0);
    //第一页的话则从第0条开始取，第二页则跳过perPage项开始取
    const perPage = Math.max(per_page * 1, 1);
    //单页的数量 Math函数返回per_page * 1与1的最大值，去除0或负值
    ctx.body = await User.find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip(page * perPage);
  }

  async getUserById(ctx) {
    const { fields } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((field) => field)
      .map((field) => '+' + field)
      .join(' '); ///使用空格隔开进行拼接 拼出来的字符串 “+location +educations” 用于让API返回指定字段
    const populateStr = fields
      .split(';')
      .filter((field) => field)
      .map((field) => {
        if (field === 'employments') {
          return 'employments.company employments.job';
        }
        if (field === 'educations') {
          return 'educations.school educations.major';
        }
        return field;
      })
      .join(' ');

    const user = await User.findById(ctx.params.id)
      .select(selectFields)
      .populate(populateStr);
    if (!user) {
      ctx.throw(404, 'User is not defined');
    }
    ctx.body = user;
  }

  async createUser(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
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
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      location: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false },
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
      password: { type: 'string', required: true },
    });
    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, 'The username or password is incorrect');
    }
    const { _id, name } = user;
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' });
    ctx.body = { token };
  }

  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, 'Authorization denied');
    }
    await next();
  }

  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+following')
      .populate('following'); //通过路由中获取的id找到用户，显示following字段，populate函数直接获取following内存储连接的user信息
    if (!user) {
      ctx.throw(404);
    }
    ctx.body = user.following;
  }

  async listFollowers(ctx) {
    const users = await User.find({ following: ctx.params.id });
    ctx.body = users;
  }

  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, 'user is not exist');
    }
    await next();
  }

  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    //获取关注者列表，ctx.state.user._id解析jwt获得用户id
    if (!me.following.map((id) => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      //将id推入following列表
      me.save(); //存入数据库
    } //防止重复逻辑
    ctx.status = 204; //返回成功状态
  }

  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following');
    const index = me.following
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    //获取取消关注的人的索引
    if (index > -1) {
      //index从0开始，如未找到就是-1
      me.following.splice(index, 1);
      me.save(); //存入数据库
    } //只删除关注的人逻辑
    ctx.status = 204; //返回成功状态
  }

  async followTopics(ctx) {
    const myTopics = await User.findById(ctx.state.user._id).select(
      '+followingTopics'
    );
    //获取关注话题列表，ctx.state.user._id解析jwt获得用户id
    if (
      !myTopics.followingTopics
        .map((id) => id.toString())
        .includes(ctx.params.id)
    ) {
      myTopics.followingTopics.push(ctx.params.id);
      //将id推入followingTopics列表
      myTopics.save(); //存入数据库
    } //防止重复逻辑
    ctx.status = 204; //返回成功状态
  }

  async unfollowTopics(ctx) {
    const myTopics = await User.findById(ctx.state.user._id).select(
      '+followingTopics'
    );
    const index = myTopics.followingTopics
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    //获取取消关注的人的索引
    if (index > -1) {
      //index从0开始，如未找到就是-1
      myTopics.followingTopics.splice(index, 1);
      myTopics.save(); //存入数据库
    } //只删除关注的人逻辑
    ctx.status = 204; //返回成功状态
  }

  async listFollowingTopics(ctx) {
    const user = await User.findById(ctx.params.id)
      .select('+followingTopics')
      .populate('followingTopics');
    if (!user) {
      ctx.throw(404, 'user is not existed');
    }
    ctx.body = user.followingTopics;
  }
}

module.exports = new userCtl();
