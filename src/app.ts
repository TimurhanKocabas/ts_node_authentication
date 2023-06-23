import express from 'express';
import { config } from './config/config';
import { dbContext } from './data/dbContext';
import log from './utils/logger';
import { routerContext } from './routes/routerContext';

const app = express();
app.use(express.json());
dbContext.connectDatabase();
routerContext.registerRoutes(app);

app.listen(config.server.port, () => {
    log.info(`App started at http://localhost:${config.server.port}`);
});
