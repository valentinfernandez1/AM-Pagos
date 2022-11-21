import app from "./app";
import connectWithRetry from "./src/utils/db";

if (!process.env.PORT) {
  require("dotenv").config();
}

const PORT = process.env.PORT || 8000;
const mongoDB = process.env.MONGO_DB_URL;

const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 300, checkperiod: 100 });

export { myCache };

connectWithRetry(mongoDB);

app.listen(PORT, () => {
  console.log(`Server listing on port ${process.env.PORT}`);
});
