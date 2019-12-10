/* eslint-disable arrow-parens */
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let requests = [];

router.get('/subscribe', async (ctx, next) => {
  const promise = new Promise(function(resolve, reject) {
    requests.push(resolve);
  });

  const message = await promise;
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  if (ctx.request.body.message) {
    requests.forEach(res => {
      res(ctx.request.body.message);
    });
    requests = [];
    ctx.body = '200';
  }
});

app.use(router.routes());

module.exports = app;
