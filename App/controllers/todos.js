const Todos = require('../models/todos');

class todosCtl {
  async getTodos(ctx) {
    ctx.body = await Todos.find();
    console.log(ctx.body);
  }

  async deleteTodos(ctx) {
    await Todos.findByIdAndDelete(ctx.params.id);
  }

  async createTodos(ctx) {
    console.log(ctx.request.body);
    await new Todos(ctx.request.body).save();
  }
}

module.exports = new todosCtl();
