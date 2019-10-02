const Koa = require("koa");
const badgen = require("badgen");
const cors = require("@koa/cors");
const app = new Koa();
const { PORT = 3000 } = process.env;

app.use(cors());
app.use(require("./util/logger"));
app.use(require("./util/referer"));
app.use(require("./util/db"));
app.use(require("./util/counter"));
app.use(require("./util/analytics"));

app.use(async ctx => {
  ctx.log.info(`site: ${ctx.site}, hit count: ${ctx.count}`);

  try {
    if (ctx.request.path.includes("counter.svg")) {
      ctx.type = "image/svg+xml";

      const options = {
        status: ctx.count,
        color: ctx.query.color || "blue",
        style: ctx.query.flat
      };

      ctx.body = badgen({
        subject: "hits",
        iconWidth: 13,
        emoji: true,
        ...options
      });
    } else {
      ctx.body = ctx.count;
    }
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit("error", err, ctx);
  }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
