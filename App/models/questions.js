const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const questionSchema = new Schema({
  __v: { type: Number, select: false },
  title: { type: String, required: true },
  description: { type: String },
  questioner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: false,
  },
  topics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false,
  },
});
//questioner 实现一对多关系，因为存在question表内
module.exports = model('Question', questionSchema);
