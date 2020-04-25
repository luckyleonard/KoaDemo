const Question = require('../models/questions');

class questionCtl {
  async getQuestion(ctx) {
    const { per_page = 5 } = ctx.query;
    const page = Math.max((ctx.query.page - 1) * 1, 0);
    const perPage = Math.max(per_page * 1, 1);
    const q = new RegExp(ctx.query.q);
    ctx.body = await Question.find({ $or: [{ title: q }, { description: q }] })
      .limit(perPage)
      .skip(page * perPage);
    //使用$or语法匹配其中之一 皆可命中
  }

  async getQuestionById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((field) => field)
      .map((field) => '+' + field)
      .join(' ');
    const question = await Question.findById(ctx.params.id)
      .select(selectFields)
      .populate('questioner');
    ctx.body = question;
  }

  async createQuestion(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false },
    });

    const question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id,
    }).save();
    //储存提问内容和提交问题的当前用户的_id
    ctx.body = question;
  }

  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select(
      '+questioner'
    );
    //把提问者也查询出来
    if (!question) {
      ctx.throw(404, 'question is not exist');
    }
    ctx.state.question = question;
    //中间件储存找到的question
    await next();
  }

  async updateQuestion(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
    });
    await ctx.state.question.updateOne(ctx.request.body);
    //在这里直接update这个question
    ctx.body = ctx.state.question;
  }

  async deleteQuestion(ctx) {
    const question = await Question.findByIdAndDelete(ctx.params.id);
    if (!question) {
      ctx.throw(404, 'Question is not exist');
    }
    ctx.status = 204;
  }

  async checkQuestioner(ctx, next) {
    const { question } = ctx.state;
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, 'Access denied');
    }
    await next();
  }

  // async listTopicFollowers(ctx) {
  //   const users = await User.find({ followingTopics: ctx.params.id });
  //   ctx.body = users;
  // }
}

module.exports = new questionCtl();
