const Topic = require('../models/topics');

class topicCtl {
  async getTopic(ctx) {
    ctx.body = await Topic.find();
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
}

module.exports = new topicCtl();
