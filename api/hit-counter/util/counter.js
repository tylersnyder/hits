module.exports = async (ctx, next) => {
  if (!ctx.referer) {
    return next();
  }

  const doc = ctx.db.collection("sites").doc(ctx.referer);
  const path = ctx.request.path;
  const shouldIncrement =
    path === "" || path === "/" || path === "/counter.svg";

  ctx.getHitCount = async () => {
    ctx.log.info(`Getting hit count...`);
    const snapshot = await doc.get("hit_count");

    if (!snapshot.exists) {
      await doc.set({ hit_count: "0" });
    }

    const data = snapshot.data();
    return Number((data && data.hit_count) || 0);
  };

  ctx.incrementHitCount = async () => {
    ctx.log.info(`Incrementing hit count...`);
    const count = String((await ctx.getHitCount()) + 1);
    await doc.set({ hit_count: count });
    return count;
  };

  ctx.count = shouldIncrement
    ? await ctx.incrementHitCount()
    : await ctx.getHitCount();

  return next();
};
