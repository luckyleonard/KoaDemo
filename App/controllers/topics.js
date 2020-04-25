const Topic = require('../models/topics');
const User = require('../models/users');
const Question = require('../models/questions');

class topicCtl {
  async getTopic(ctx) {
    const { per_page = 5 } = ctx.query; //获取分页默认参数
    const page = Math.max((ctx.query.page - 1) * 1, 0);
    //第一页的话则从第0条开始取，第二页则跳过perPage项开始取
    const perPage = Math.max(per_page * 1, 1);
    //单页的数量 Math函数返回per_page * 1与1的最大值，去除0或负值
    ctx.body = await Topic.find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip(page * perPage);
    //limit只获取n条，skip跳过前n条,
    //find里面匹配正则表达式
  }

  async getTopicById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((field) => field)
      .map((field) => '+' + field)
      .join(' ');
    const topic = await Topic.findById(ctx.params.id).select(selectFields);
    ctx.body = topic;
  }

  async createTopic(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    });
    const { name } = ctx.request.body;
    const existedTopic = await Topic.findOne({ name });
    if (existedTopic) {
      ctx.throw(409, 'Topic has exist');
    } //verify unique topic
    const topic = await new Topic(ctx.request.body).save();
    ctx.body = topic;
  }

  async updateTopic(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    });
    const topic = await Topic.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    );
    ctx.body = topic;
  }

  async checkTopicExist(ctx, next) {
    const topic = await Topic.findById(ctx.params.id);
    if (!topic) {
      ctx.throw(404, 'topic is not exist');
    }
    await next();
  }

  async listTopicFollowers(ctx) {
    const users = await User.find({ followingTopics: ctx.params.id });
    ctx.body = users;
  }

  async listQuestions(ctx) {
    const questions = await Question.find({ topics: ctx.params.id });
    ctx.body = questions;
  }
}

module.exports = new topicCtl();
