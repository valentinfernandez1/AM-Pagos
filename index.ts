import express from 'express';
import logger from 'morgan';
import NotFoundError from './src/errors/notFoundError';
import routes from './src/router/index.routes';
import errorHandler from './src/middlewares/errorHandler';

const app = express();

if (!process.env.PORT) {
  require('dotenv').config();
}

//Definicion del conjunto de rutas correspondiente a user
for (const route of routes.userRoutes) {
  app
    .use(express.json({limit: '50mb'}))
    .use(logger('dev'))
    .use("/api/user", route);
}

//Definicion de las rutas para utilities. Ej /health
for (const route of routes.utilityRoutes) {
  app
    .use(express.json({limit: '50mb'}))
    .use(logger('dev'))
    .use("/", route);
}

app.all('*', (req: express.Request) => {
  throw new NotFoundError(req.path);
});

//Error Handlers
app.use(errorHandler);



app.listen(process.env.PORT, () => {
  console.log(`server listing on port ${process.env.PORT}`);
});
