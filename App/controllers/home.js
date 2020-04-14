const path = require('path');

class HomeCtl {
  index(ctx) {
    ctx.body = 'this is homepage';
  }
  upload(ctx) {
    const file = ctx.request.files.file; //name为file的input
    const basename = path.basename(file.path); //这是文件名
    ctx.body = { url: `${ctx.origin}/uploads/${basename}` };
  }
}

module.exports = new HomeCtl(); //
