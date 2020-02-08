require('dotenv').config();
const { DB_CLUSTER, DB_USER, DB_PASSWORD, DB_RETRYWRITES, DB_W } = process.env;

module.exports = {
  connectionStr: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER}?retryWrites=${DB_RETRYWRITES}&w=${DB_W}`
};
