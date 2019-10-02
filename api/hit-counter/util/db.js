const firebase = require("firebase-admin");
const credentials = require("../credentials.json");
const databaseURL = `https://${credentials.project_id}.firebaseio.com`;

firebase.initializeApp({
  credential: firebase.credential.cert(credentials),
  databaseURL
});

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

module.exports = async (ctx, next) => {
  ctx.log.info(`Attaching database ${databaseURL}...`);
  ctx.db = db;
  return next();
};
