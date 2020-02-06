class HomeCtl {
  index(ctx) {
    ctx.body = 'this is homepage';
  }
}

module.exports = new HomeCtl(); //
