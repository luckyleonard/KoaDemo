const Answer = require('../models/answers');

class answerCtl {
  async getAnswer(ctx) {
    const { per_page = 5 } = ctx.query;
    const page = Math.max((ctx.query.page - 1) * 1, 0);
    const perPage = Math.max(per_page * 1, 1);
    const q = new RegExp(ctx.query.q);
    ctx.body = await Answer.find({
      content: q,
      questionId: ctx.params.questionId,
    })
      .limit(perPage)
      .skip(page * perPage);
    //通过内容匹配，并且从url获取questionId
  } //获取这个问题的所有answer或q内的模糊匹配

  async getAnswerById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((field) => field)
      .map((field) => '+' + field)
      .join(' ');
    const answer = await Answer.findById(ctx.params.id)
      .select(selectFields)
      .populate('answerer');
    ctx.body = answer;
  }

  async createAnswer(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
    });

    const answerer = ctx.state.user._id;
    const { questionId } = ctx.params;

    const answer = await new Answer({
      ...ctx.request.body,
      answerer,
      questionId,
    }).save();
    //储存回答者为当前_id，和questionId从url里获取
    ctx.body = answer;
  }

  async checkAnswerExist(ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select('+answerer');
    //把回答者也查询出来
    if (!answer) {
      ctx.throw(404, 'answer is not exist');
    }
    if (ctx.params.questionId && answer.questionId !== ctx.params.questionId) {
      ctx.throw(404, 'Not a answer for this question');
    }
    //只有删改查答案的时候才会检查这个逻辑，赞/踩的时候不检查
    ctx.state.answer = answer;
    //中间件储存找到的answer
    await next();
  }

  async checkAnswerer(ctx, next) {
    const { answer } = ctx.state;
    if (answer.answerer.toString() !== ctx.state.user._id) {
      ctx.throw(403, 'Access denied');
    }
    await next();
  }

  async updateAnswer(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false },
    });
    await ctx.state.answer.updateOne(ctx.request.body);
    //在这里直接update这个answer
    ctx.body = ctx.state.answer;
  }

  async deleteAnswer(ctx) {
    const answer = await Answer.findByIdAndDelete(ctx.params.id);
    if (!answer) {
      ctx.throw(404, 'Answer is not exist');
    }
    ctx.status = 204;
  }

  // async listTopicFollowers(ctx) {
  //   const users = await User.find({ followingTopics: ctx.params.id });
  //   ctx.body = users;
  // }
}

module.exports = new answerCtl();
