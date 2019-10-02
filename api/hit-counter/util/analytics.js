module.exports = async (ctx, next) => {
  const headers = ctx.request.headers;
  const doc = ctx.db.collection("analytics").doc(`${ctx.referer}`);

  // @todo push meta data about each hit to a collection
  doc.set({
    "user-agent": headers["user-agent"],
    "accept-language": headers["accept-language"],
    cookie: headers.cookie
  });

  return next();
};
