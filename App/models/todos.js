const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const todosSchema = new Schema({
  item: { type: String, required: false }
});

module.exports = model('Todos', todosSchema);
