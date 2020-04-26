const Comment = require('../models/comments');

class commentCtl {
  async getComment(ctx) {
    const { per_page = 5 } = ctx.query;
    const page = Math.max((ctx.query.page - 1) * 1, 0);
    const perPage = Math.max(per_page * 1, 1);
    const q = new RegExp(ctx.query.q);
    const { questionId, answerId } = ctx.params;
    const { rootCommentId } = ctx.query;
    //获取以这个评论为基础的二级评论
    ctx.body = await Comment.find({
      content: q,
      questionId,
      answerId,
      rootCommentId,
    })
      .limit(perPage)
      .skip(page * perPage)
      .populate('commentator replyTo');
    //按需提取评论用户的详细信息，和二级评论的回复人信息，
  }

  async getCommentById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((field) => field)
      .map((field) => '+' + field)
      .join(' ');
    const comment = await Comment.findById(ctx.params.id)
      .select(selectFields)
      .populate('commentator');
    ctx.body = comment;
  }

  async createComment(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      rootCommentId: { type: 'string', required: false },
      replyTo: { type: 'string', required: false },
    });

    const commentator = ctx.state.user._id;
    const { questionId, answerId } = ctx.params;

    const comment = await new Comment({
      ...ctx.request.body,
      commentator,
      questionId,
      answerId,
    }).save();
    //储存回答者为当前_id，和questionId,answerId从url里获取
    ctx.body = comment;
  }

  async checkCommentExist(ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select(
      '+commentator'
    );
    if (!comment) {
      ctx.throw(404, 'comment is not exist');
    }
    if (ctx.params.questionId && comment.questionId !== ctx.params.questionId) {
      ctx.throw(404, 'Not a comment for this question');
    }
    if (ctx.params.answerId && comment.answerId !== ctx.params.answerId) {
      ctx.throw(404, 'Not a comment for this answer');
    }

    ctx.state.comment = comment;
    //中间件储存找到的comment
    await next();
  }

  async checkCommentator(ctx, next) {
    const { comment } = ctx.state;
    if (comment.commentator.toString() !== ctx.state.user._id) {
      ctx.throw(403, 'Access denied');
    }
    await next();
  }

  async updateComment(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false },
    });
    const { content } = ctx.request.body;
    await ctx.state.comment.updateOne({ content });
    //只允许更新content内容，防止变更评论层级
    ctx.body = ctx.state.comment;
  }

  async deleteComment(ctx) {
    const comment = await Comment.findByIdAndDelete(ctx.params.id);
    if (!comment) {
      ctx.throw(404, 'Comment is not exist');
    }
    ctx.status = 204;
  }
}

module.exports = new commentCtl();
