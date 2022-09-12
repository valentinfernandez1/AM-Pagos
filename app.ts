import express, { Application } from "express";
import logger from "morgan";
import NotFoundError from "./src/errors/notFoundError";
import routes from "./src/router/index.routes";
import errorHandler from "./src/middlewares/errorHandler";
import cors from "cors";
require("dotenv").config();
//SWAGGER IMPORTS
const swaggerUi = require("swagger-ui-express");
import * as swaggerDocument from "./swagger.json";
export const app: Application = express();

//CORS
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(logger("dev"));

const middlewareUser = (req, res, next) => {
  const { headerkey } = req.headers;

  if (headerkey === process.env.HeaderKey) {
    next();
  } else {
    return res.status(401).json({
      msg: "Header key invalida",
    });
  }
};

//Utility
for (const route of routes.utilityRoutes) {
  app.use(express.json({ limit: "50mb" })).use("/", middlewareUser, route);
}

app.all("*", (req: express.Request) => {
  throw new NotFoundError(req.path);
});

//Error Handlers
app.use(errorHandler);

export default app;
