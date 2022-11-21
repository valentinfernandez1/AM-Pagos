import express, { Application } from "express";
import logger from "morgan";
import NotFoundError from "./src/errors/notFoundError";
import routes from "./src/services/index.routes";
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

//Utility
for (const route of routes.paymentRoutes) {
  app.use(express.json({ limit: "50mb" })).use("/v1", route);
}

for (const route of routes.utilityRoutes) {
  app.use(express.json({ limit: "50mb" })).use("/", route);
}

app.all("*", (req: express.Request) => {
  throw new NotFoundError(req.path);
});

//Error Handlers
app.use(errorHandler);

export default app;
