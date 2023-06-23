import { Express, Request, Response, NextFunction } from 'express';
import healthCheckRouter from './healthCheck.routes';
import log from '../utils/logger';
import userRouter from './user.routes';

const logRequestAndResponse = (req: Request, res: Response, next: NextFunction) => {
    /** Log the request */
    log.info(`Incoming -> Method:[${req.method}] - Url: [${req.url}] - IP:[${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        /** Log the response */
        log.info(`Outgoing -> Method:[${req.method}] - Url: [${req.url}] - IP:[${req.socket.remoteAddress}] - Status:[${res.statusCode}]`);
    });
    next();
};

const registerRoutes = (expressApp: Express) => {
    expressApp.use(logRequestAndResponse);
    expressApp.use(healthCheckRouter);
    expressApp.use(userRouter);
};
export const routerContext = {
    registerRoutes
};
