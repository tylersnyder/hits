module.exports = async (ctx, next) => {
  const origin = ctx.request.headers.referer || ctx.origin;
  ctx.referer = origin.split("://")[1];
  return next();
};
